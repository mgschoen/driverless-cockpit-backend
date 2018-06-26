const schemaDefinitions = {
  CLARA: [
    {
      blockName: 'observations',
      type: 'array',
      members: [
        {name: 'x', type: 'number'},
        {name: 'y', type: 'number'}
      ]
    },
    {
      blockName: 'clusters',
      type: 'array',
      members: [
        {name: 'middleX', type: 'number'},
        {name: 'middleY', type: 'number'},
        {name: 'covXX', type: 'number'},
        {name: 'covXY', type: 'number'},
        {name: 'covYY', type: 'number'},
        {name: 'id', type: 'string'},
        {name: 'color', type: 'number'},
      ]
    },
    {
      blockName: 'vehicle',
      type: 'object',
      members: [
        {name: 'x', type: 'number'},
        {name: 'y', type: 'number'},
        {name: 'yaw', type: 'number'},
        {name: 'vehicleVelocityX', 'type': 'number'},
        {name: 'vehicleVelocityY', 'type': 'number'},
        {name: 'vehicleAccelerationX', 'type': 'number'},
        {name: 'vehicleAccelerationY', 'type': 'number'},
        {name: 'steerAngle', 'type': 'number'}
      ]
    }
  ],
  TRAJECTORY: [
    {
      blockName: 'primitives',
      type: 'array',
      members: [
        {name: 'x', type: 'number'},
        {name: 'y', type: 'number'}
      ]
    },
    {
      blockName: 'trajectory',
      type: 'array',
      members: [
        {name: 'x', type: 'number'},
        {name: 'y', type: 'number'}
      ]

    }
  ],
  BASECASE: [
    {
      blockName: 'pathMiddlePoints',
      type: 'array',
      members: [
        {name: 'x', type: 'number'},
        {name: 'y', type: 'number'}
      ]
    }
  ]
};

/**
 * Process a message block that was defined as array
 * @param {string} message - raw content of the block, excluding surrounding '|' characters
 * @param {object} schema - block schema from message schema defined in `schemaDefinitions`
 * @returns {Array} - parsed block as a JavaScript array
 */
let parseArrayBlock = (message, schema) => {
  let arrayItems = message.split(';')
      .map(item => item.trim())
      .filter(item => item.length > 0);

  let parsedBlock = [];
  for (let item of arrayItems) {
    parsedBlock.push(parseObjectBlock(item, schema));
  }

  return parsedBlock;
};

/**
 * Process a message block that was defined as object
 * @param {string} message - raw content of the block, excluding surrounding '|' characters
 * @param {object} schema - block schema from message schema defined in `schemaDefinitions`
 * @returns {object} - parsed block as a JavaScript object literal
 */
let parseObjectBlock = (message, schema) => {
  let fields = message.split(',')
      .map(field => field.trim())
      .filter(field => field.length > 0);
  if (fields.length !== schema.members.length) {
    throw new Error('Message does not correspond to schema: Expected ' + schema.members.length + ' fields ' +
        ((schema.type === 'array') ? 'in member of block "' : ' in block "') +
        schema.blockName + '" but found ' + fields.length);
  }

  let parsedBlock = {};
  schema.members.forEach((member, i) => {
    switch (member.type) {
      case 'number':
        parsedBlock[member.name] = parseFloat(fields[i]);
        break;
      case 'string':
        parsedBlock[member.name] = fields[i];
        break;
      case 'boolean':
        parsedBlock[member.name] = (fields[i] === 'true');
        break;
      default:
        throw new Error('Schema invalid: Data type "' + member.type + '" not allowed ' +
            '(found in ' + ((schema.type === 'array') ? 'member of ' : '') + 'block "' + schema.blockName + '")');
    }
  });

  return parsedBlock;
};

/*
 Example Messages:
 TRAJECTORY|0,0,2.0992,-0.052198,0.94976,-0.019921,0,0,-1.45E-11,-4.79E-08,5.40E-08
 CLARA|8.21617,-2.73031;9.68998,0.554175|8.21298,-2.74674,0.45001,5.23295e-05,0.45027,1,0;9.68674,0.537771,0.45001,5.3149e-05,0.450269,1,1|0,0
 */

module.exports = {
    /**
     * Validate a raw vehicle message and convert it into a JavaScript object literal
     * in case it is valid
     * @param {string} message - string starting with a schema identifier (e.g. 'CLARA', 'TRAJECTORY'), followed by
     *                           a number of blocks separated by '|' characters
     * @returns {{schema: string, content}}
     */
    parseMessage: message => {

        let blocks = message.split('|');
        let schemaIdentifier = blocks[0].trim();
        let schema = schemaDefinitions[schemaIdentifier];
        if (!schema) {
            throw new Error('Schema identifier "' + blocks[0] + '" unknown');
        }

        let messageContentBlocks = blocks.slice(1);
        let numBlocks = messageContentBlocks.length;
        if (numBlocks !== schema.length) {
            throw new Error('Message does not correspond to schema: Expected ' + schema.length
                + ' blocks but found ' + messageContentBlocks.length);
        }

        let parsedMessage = {};
        for (let i = 0; i < numBlocks; i++) {
            let currentBlock = messageContentBlocks[i];
            let currentBlockSchema = schema[i];
            let parsedBlock;
            switch (currentBlockSchema.type) {
                case 'array':
                    parsedBlock = parseArrayBlock(currentBlock, currentBlockSchema);
                    break;
                case 'object':
                    parsedBlock = parseObjectBlock(currentBlock, currentBlockSchema);
                    break;
                default:
                    throw new Error('Schema invalid: Unknown block type "' + currentBlockSchema.type + '"');
            }
            parsedMessage[currentBlockSchema.blockName] = parsedBlock;
        }

        return {
            schema: schemaIdentifier,
            content: parsedMessage
        };
    }

};