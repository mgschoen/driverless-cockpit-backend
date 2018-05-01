const atomicDataTypes = ['number', 'string', 'boolean'];
const schemaDefintions = {
  TRAJECTORY: [
    {
      blockName: 'vehicle',
      type: 'object',
      members: [
        {name: 'steerAngle', 'type': 'number'},
        {name: 'pathMiddleX', 'type': 'number'},
        {name: 'pathMiddleY', 'type': 'number'},
        {name: 'velocityX', 'type': 'number'},
        {name: 'velocityY', 'type': 'number'},
        {name: 'frontwheelLeftRotation', 'type': 'number'},
        {name: 'frontwheelRightRotation', 'type': 'number'}
      ]
    }
  ],
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
        {name: 'vehicleX', type: 'number'},
        {name: 'vehicleY', type: 'number'},
        {name: 'yaw', type: 'number'}
      ]
    }
  ]
};

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
 ACTUATORS|0,0,2.0992,-0.052198,0.94976,-0.019921,0,0,-1.45E-11,-4.79E-08,5.40E-08
 CLARA|8.21617,-2.73031;9.68998,0.554175|8.21298,-2.74674,0.45001,5.23295e-05,0.45027,1,0;9.68674,0.537771,0.45001,5.3149e-05,0.450269,1,1|0,0
 */

module.exports = {

  parseMessage: message => {

    let blocks = message.split('|');
    let schema = schemaDefintions[blocks[0]];
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

    return parsedMessage;
  }

};