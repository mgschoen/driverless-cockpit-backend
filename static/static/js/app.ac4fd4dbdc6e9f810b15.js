webpackJsonp([1],{0:function(t,e){},"1/oy":function(t,e){},"6Q7+":function(t,e){},"9M+g":function(t,e){},Bc8N:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIKICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoKICA8cG9seWdvbiBwb2ludHM9IjAsMCAxMSw2IDAsMTIiIGZpbGw9ImxpZ2h0Z3JlZW4iIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz4KPC9zdmc+Cg=="},Fphx:function(t,e){},IXiI:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHZpZXdCb3g9IjAgMCA4IDgiPgogIDxwYXRoIGZpbGw9IndoaXRlIiBkPSJNNCAwYy0xLjY1IDAtMyAxLjM1LTMgM2gtMWwxLjUgMiAxLjUtMmgtMWMwLTEuMTEuODktMiAyLTJ2LTF6bTIuNSAxbC0xLjUgMmgxYzAgMS4xMS0uODkgMi0yIDJ2MWMxLjY1IDAgMy0xLjM1IDMtM2gxbC0xLjUtMnoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMSkiIC8+Cjwvc3ZnPg=="},Id91:function(t,e){},Jmt5:function(t,e){},KHPl:function(t,e){t.exports={padZeros:function(t,e){var a=(e+"").length,i=Math.max(0,t-a);return"0".repeat(i)+e},timerFormat:function(t){var e=Math.floor(t/6e4),a=Math.floor(t%6e4/1e3),i=t%1e3;return this.padZeros(2,e)+":"+this.padZeros(2,a)+":"+this.padZeros(3,i)},validateObjectSchema:function(t,e){var a=[];return e.forEach(function(e){t.hasOwnProperty(e)||a.push(e)}),0===a.length?{valid:!0,missing:a}:{valid:!1,missing:a}},meterToPixels:function(t){return Math.round(10*t)}}},N3eC:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("7+uW"),s=a("e6fC"),r=a("8+8L"),o=a("/ocq"),n=a("NYxO"),l=a("pFYg"),c=a.n(l),d=a("KHPl"),h=a.n(d),p=a("V8gR"),u=a.n(p),v=["playing","paused","stopped"],m=["live","replay"],g={updateEntity:function(t,e){var a=u.a.getStateObjectFromIdentifier(t,e.entityIdentifier);for(var i in e.payload)a.hasOwnProperty(i)&&(a[i]=e.payload[i])},updateRecordings:function(t,e){if("object"!==(void 0===e?"undefined":c()(e)))throw new Error("recordings must be an Array");t.recordings=e},updateReplayMode:function(t,e){if(!(v.indexOf(e)>=0))throw new Error(e+" is not a valid replay mode");t.replay.mode=e},updateReplayRecording:function(t,e){t.replay.selectedRecording=e},updateReplayRecordingActiveFrame:function(t,e){var a=t.replay.selectedRecording,i=a.frames,s=Number.POSITIVE_INFINITY,r=-1,o=a.start+e;if(a.start+e>a.end||e<0)throw new Error("newPosition is out of bounds of selectedRecordings: "+e);i.forEach(function(t,e){var a=Math.abs(o-t.timestamp);a<s&&(s=a,r=e)}),t.replay.activeFrame=i[r]},updateReplayDelta:function(t,e){t.replay.delta=e},updateGlobalLoader:function(t,e){var a=h.a.validateObjectSchema(e,["show","message"]);if(!a.valid)throw new Error("Missing properties: "+a.missing);t.globalLoader.message=e.message,t.globalLoader.show=e.show},updateViewDataSource:function(t,e){if(!(m.indexOf(e)>=0))throw new Error(e+" is not a valid data source");t.viewDataSource=e}},f=a("//Fk"),b=a.n(f),y={fetchRecordings:function(t){return new b.a(function(e,a){i.a.http.get("recordings").then(function(a){t.commit("updateRecordings",a.body),e()},function(t){a(t)})})},fetchReplayRecording:function(t,e){return new b.a(function(a,s){i.a.http.get("recording/"+e).then(function(e){t.commit("updateReplayRecording",e.body),a()},function(t){s(t)})})},switchRecordingStatus:function(t,e){return new b.a(function(a,s){var r=u.a.getApiRouteFromIdentifier(e);i.a.http.get(r).then(function(e){t.commit("updateEntity",{entityIdentifier:"appState",payload:e.body}),a()},function(t){s(t)})})},startRefreshingEntity:function(t,e){var a=u.a.getStateObjectFromIdentifier(t.state,e);a.refresh||(a.refresh=!0,t.dispatch("entityRefreshTick",e))},stopRefreshingEntity:function(t,e){u.a.getStateObjectFromIdentifier(t.state,e).refresh=!1},entityRefreshTick:function(t,e){var a=u.a.getConfigFromIdentifier(e),s=u.a.getStateObjectFromIdentifier(t.state,e),r=u.a.getApiRouteFromIdentifier(e);i.a.http.get(r).then(function(i){var r=i.body,o=h.a.validateObjectSchema(r,a.requiredProperties);o.valid?(t.commit("updateEntity",{entityIdentifier:e,payload:r}),s.refresh&&window.setTimeout(function(a){t.dispatch("entityRefreshTick",e)},a.refreshInterval)):console.log(new Error("Missing properties: "+o.missing.toString()))},function(t){console.log(t)})}};i.a.use(n.a);var w=new n.a.Store({state:{apiRoot:"/",appState:{refresh:!1,activeRecording:null,connected:!1,recording:!1,presentationMode:!1},liveStats:{refresh:!1,timestamp:0,steerAngle:0,pathMiddleX:0,pathMiddleY:0,vehicleX:0,vehicleY:0,vehicleVelocityX:0,vehicleVelocityY:0,vehicleRotation:0,frontwheelLeftRotation:0,frontwheelRightRotation:0,observations:[],clusters:{},trajectoryPrimitives:[],trajectoryHash:0,trajectory:[]},replay:{mode:"stopped",delta:0,selectedRecording:null,activeFrame:null},recordings:[],globalLoader:{show:!1,message:"Loading..."},viewDataSource:"live"},mutations:g,actions:y}),x=a("Dd8w"),S=a.n(x),I=a("/V0p"),M={name:"RecordingControls",data:function(){return{correctPassphraseHashed:"c4ae69280ce2f63b5983bfd58d4e80395b1a33a77d54dca7d3db146db4a701b803e45a088a4fe849d78ec5ad703f8856aea0285bbebbefc5285ceddef4c7d8f7",enteredPassphrase:"",showPrompt:!1,error:!1,action:"record",hasher:new I.SHA512}},computed:S()({clipPosition:function(){return this.appState&&this.appState.recording?(new Date).getTime()-this.appState.activeRecording.start:0},counterValue:function(){return h.a.timerFormat(this.clipPosition)}},Object(n.b)({appState:"appState"})),methods:{triggerRecording:function(){this.appState.recording||(this.appState.presentationMode?(this.action="record",this.showPrompt=!0):this.record())},triggerStop:function(){this.appState.recording&&(this.appState.presentationMode?(this.action="stop",this.showPrompt=!0):this.stop())},record:function(){this.$store.dispatch("switchRecordingStatus","start").then(null,function(t){console.log(t)})},stop:function(){var t=this;this.$store.dispatch("switchRecordingStatus","stop").then(function(e){t.$router.push("/recordings")},function(t){console.log(t)})},checkPassphrase:function(){if(this.hasher.hex(this.enteredPassphrase)===this.correctPassphraseHashed){switch(this.action){case"record":this.record();break;case"stop":default:this.stop()}this.showPrompt=!1}else this.error=!0;this.enteredPassphrase=""}}},_={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("b-row",{attrs:{"align-h":"end"}},[t.appState.recording?a("b-col",{staticClass:"pr-0",attrs:{cols:"auto"}},[a("code",{staticClass:"button-indent"},[t._v(t._s(t.counterValue))])]):t._e(),t._v(" "),a("b-col",{attrs:{cols:"auto"}},[a("b-button-group",[a("b-button",{attrs:{disabled:!t.appState.recording},on:{click:t.triggerStop}},[a("span",{staticClass:"panelIcon stop"})]),t._v(" "),a("b-button",{attrs:{pressed:t.appState.recording},on:{click:t.triggerRecording}},[a("span",{staticClass:"panelIcon record"})])],1)],1)],1),t._v(" "),a("b-modal",{attrs:{title:"Enter Passphrase","no-close-on-esc":"","no-close-on-backdrop":"","hide-header-close":""},model:{value:t.showPrompt,callback:function(e){t.showPrompt=e},expression:"showPrompt"}},[t.error?a("p",{staticClass:"errorMessage"},[t._v("Wrong passphrase. Please try again.")]):t._e(),t._v(" "),a("b-form-input",{attrs:{type:"password"},model:{value:t.enteredPassphrase,callback:function(e){t.enteredPassphrase=e},expression:"enteredPassphrase"}}),t._v(" "),a("div",{attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("b-button",{attrs:{variant:"secondary"},on:{click:t.checkPassphrase}},[t._v("Ok")])],1)],1)],1)},staticRenderFns:[]};var C=a("VU/8")(M,_,!1,function(t){a("6Q7+")},"data-v-622baed5",null).exports,R=a("GDE4"),P=a.n(R),L={name:"ReplayControls",props:{clipID:String},data:function(){return{lastTickAt:0,position:0,sliderOptions:{tooltip:"hover",processStyle:{backgroundColor:"rgba(190,22,33,1)"},tooltipStyle:{backgroundColor:"rgba(50,50,50,1)",borderColor:"rgba(50,50,50,1)"},max:100}}},computed:Object(n.b)({replayGlobals:"replay",counterValue:function(){return h.a.timerFormat(this.position)}}),watch:{position:function(t,e){this.$store.commit("updateReplayDelta",t-e),this.$store.commit("updateReplayRecordingActiveFrame",t)}},mounted:function(){var t=this;this.$store.commit("updateGlobalLoader",{show:!0,message:"Loading clip..."}),this.position=0,this.$store.dispatch("fetchReplayRecording",this.clipID).then(function(e){var a=t.replayGlobals.selectedRecording;t.sliderOptions.max=a.end-a.start,t.$store.commit("updateReplayRecordingActiveFrame",t.position),t.$store.commit("updateGlobalLoader",{show:!1,message:""})},function(t){console.log(t)})},methods:{playTick:function(){switch(this.replayGlobals.mode){case"playing":var t=(new Date).getTime(),e=this.lastTickAt?t-this.lastTickAt:0;e<this.sliderOptions.max-this.position?(this.position+=e,this.lastTickAt=t,window.setTimeout(this.playTick,100)):(this.pause(),this.position=this.sliderOptions.max);break;case"paused":this.lastTickAt=0}},play:function(){"playing"!==this.replayGlobals.mode&&(this.$store.commit("updateReplayMode","playing"),this.playTick())},pause:function(){"playing"===this.replayGlobals.mode&&this.$store.commit("updateReplayMode","paused")},stop:function(){0!==this.position&&(this.$store.commit("updateReplayMode","stopped"),this.position=0,this.lastTickAt=0)}},components:{vueSlider:P.a}},j={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("b-row",[i("b-col",{attrs:{sm:"auto"}},[i("p",[t._v("Replay clip: "),i("code",[t._v(t._s(t.clipID))])])])],1),t._v(" "),i("b-row",{attrs:{"align-h":"start"}},[i("b-col",{attrs:{order:"0",cols:"auto"}},[i("b-button-group",[i("b-button",{attrs:{pressed:"playing"===t.replayGlobals.mode},on:{click:t.play}},[i("img",{attrs:{src:a("Bc8N")}})]),t._v(" "),i("b-button",{attrs:{disabled:"playing"!==t.replayGlobals.mode},on:{click:t.pause}},[i("span",{staticClass:"panelIcon pause"})]),t._v(" "),i("b-button",{attrs:{disabled:0===t.position},on:{click:t.stop}},[i("span",{staticClass:"panelIcon stop"})])],1)],1),t._v(" "),i("b-col",{staticClass:"p-0",attrs:{order:"1",col:"",sm:"auto"}},[i("code",{staticClass:"button-indent"},[t._v("\n        "+t._s(t.counterValue)+"\n      ")])]),t._v(" "),i("b-col",{attrs:{order:"3","order-sm":"2",cols:"12",sm:""}},[i("vue-slider",t._b({staticClass:"tape",attrs:{formatter:t.counterValue},model:{value:t.position,callback:function(e){t.position=e},expression:"position"}},"vue-slider",t.sliderOptions,!1))],1),t._v(" "),i("b-col",{staticClass:"pl-0",attrs:{order:"2","order-sm":"3",cols:"3",sm:"auto"}},[i("b-button",{attrs:{variant:"secondary",to:"/dashboard/live"}},[i("img",{attrs:{src:a("frZY")}})])],1)],1)],1)},staticRenderFns:[]};var T=a("VU/8")(L,j,!1,function(t){a("XySv")},"data-v-b5ab097c",null).exports,k=a("xLKd"),A=a.n(k),O=a("bOdI"),V=a.n(O),D={name:"switches",props:{typeBold:{default:!1},value:{default:!1},disabled:{default:!1},label:{default:""},textEnabled:{default:""},textDisabled:{default:""},color:{default:"default"},theme:{default:"default"},emitOnMount:{default:!0}},mounted:function(){this.emitOnMount&&this.$emit("input",this.value)},methods:{trigger:function(t){this.$emit("input",t.target.checked)}},computed:{classObject:function(){var t,e=this.color,a=this.value,i=this.theme,s=this.typeBold,r=this.disabled;return t={"vue-switcher":!0},V()(t,"vue-switcher--unchecked",!a),V()(t,"vue-switcher--disabled",r),V()(t,"vue-switcher--bold",s),V()(t,"vue-switcher--bold--unchecked",s&&!a),V()(t,"vue-switcher-theme--"+i,e),V()(t,"vue-switcher-color--"+e,e),t},shouldShowLabel:function(){return""!==this.label||""!==this.textEnabled||""!==this.textDisabled}}},F={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("label",{class:t.classObject},[t.shouldShowLabel?a("span",{staticClass:"vue-switcher__label"},[t.label?a("span",{domProps:{textContent:t._s(t.label)}}):t._e(),t._v(" "),!t.label&&t.value?a("span",{domProps:{textContent:t._s(t.textEnabled)}}):t._e(),t._v(" "),t.label||t.value?t._e():a("span",{domProps:{textContent:t._s(t.textDisabled)}})]):t._e(),t._v(" "),a("input",{attrs:{type:"checkbox",disabled:t.disabled},domProps:{checked:t.value},on:{change:t.trigger}}),t._v(" "),a("div")])},staticRenderFns:[]};var E=a("VU/8")(D,F,!1,function(t){a("fYSq")},null,null).exports,Z={scaleStage:function(t,e,a){var i=this.stage.scaleX(),s=e/i-this.stage.x()/i,r=a/i-this.stage.y()/i,o=t>0?i*this.zoomStep:i/this.zoomStep,n=o<this.minZoomScale?this.minZoomScale:o>this.maxZoomScale?this.maxZoomScale:o;this.stage.scale({x:n,y:n});var l={x:-(s-e/n)*n,y:-(r-a/n)*n};this.stage.position(l),this.redrawGrid(),this.stage.batchDraw(),this.zoomLevel=parseFloat(Math.round(100*n)/100).toFixed(2)},performZoom:function(t){t.stopPropagation(),t.preventDefault();var e=t.wheelDeltaY||-t.deltaY,a=this.stage.getPointerPosition();this.scaleStage(e,a.x,a.y)},performZoomTouch:function(t){if(2===t.targetTouches.length){t.stopPropagation(),t.preventDefault();var e=t.targetTouches[0],a=t.targetTouches[1],i=Math.sqrt(Math.pow(e.clientX-a.clientX,2)+Math.pow(e.clientY-a.clientY,2));if(this.lastTouchDistance){var s=i-this.lastTouchDistance,r={x:(e.clientX+a.clientX)/2,y:(e.clientY+a.clientY)/2},o=this.stage.attrs.container.getBoundingClientRect(),n={x:r.x-o.x,y:r.y-o.y};this.scaleStage(s,n.x,n.y)}else this.lastTouchDistance=i}}},G=a("BO1k"),H=a.n(G),X={drive:function(){var t="live"===this.viewDataSource?this.liveStats:this.replay.activeFrame;t&&(this.animateVehicle(t.vehicleX,t.vehicleY),this.animateObservations(t.observations),this.animateClusters(t.clusters),this.animateTrajectory(t.trajectory,t.trajectoryHash))},animateVehicle:function(t,e){if(this.shapeVehicle){var a={x:t,y:e};if(a.x!==this.lastKnownVehiclePosition.x||a.y!==this.lastKnownVehiclePosition.y){this.shapeVehicle.position({x:Object(d.meterToPixels)(a.x),y:Object(d.meterToPixels)(a.y)});var i={x:a.x-this.lastKnownVehiclePosition.x,y:a.y-this.lastKnownVehiclePosition.y},s=Math.sqrt(Math.pow(i.x,2)+Math.pow(i.y,2)),r=i.x/s,o=Math.acos(r)*(180/Math.PI),n=i.y>=0?o:360-o;"replay"===this.viewDataSource&&this.replay.delta<0&&(n=(n+180)%360),this.shapeVehicle.rotation(n),this.lastKnownVehiclePosition.x=a.x,this.lastKnownVehiclePosition.y=a.y}}},animateObservations:function(t){var e=[],a=!0,i=!1,s=void 0;try{for(var r,o=H()(t);!(a=(r=o.next()).done);a=!0){var n=r.value;e.push(new A.a.Circle({x:Object(d.meterToPixels)(n.x),y:Object(d.meterToPixels)(n.y),radius:Object(d.meterToPixels)(.2),fill:"black"}))}}catch(t){i=!0,s=t}finally{try{!a&&o.return&&o.return()}finally{if(i)throw s}}var l=!0,c=!1,h=void 0;try{for(var p,u=H()(this.observationsShapes);!(l=(p=u.next()).done);l=!0){p.value.destroy()}}catch(t){c=!0,h=t}finally{try{!l&&u.return&&u.return()}finally{if(c)throw h}}var v=!0,m=!1,g=void 0;try{for(var f,b=H()(e);!(v=(f=b.next()).done);v=!0){var y=f.value;this.observationsLayer.add(y)}}catch(t){m=!0,g=t}finally{try{!v&&b.return&&b.return()}finally{if(m)throw g}}this.observationsShapes=e,this.observationsLayer.draw()},animateClusters:function(t){for(var e in t){var a=t[e],i={x:Object(d.meterToPixels)(a.middleX),y:Object(d.meterToPixels)(a.middleY)},s=Object(d.meterToPixels)(Math.max(a.width,a.height)),r=this.isInVisibleWorld(i,s),o=this.clusterShapes.hasOwnProperty(e);if(r)if(o){if(a.hash!==this.clusterHashes[e]){this.clusterShapes[e].position({x:Object(d.meterToPixels)(a.middleX),y:Object(d.meterToPixels)(a.middleY)}),this.clusterShapes[e].rotation=a.angle;for(var n=this.clusterShapes[e].getChildren(),l=n.length;l>0;l--)n[l-1].size({width:Object(d.meterToPixels)(a.width*l),height:Object(d.meterToPixels)(a.height*l)})}}else{for(var c=new A.a.Group({x:Object(d.meterToPixels)(a.middleX),y:Object(d.meterToPixels)(a.middleY),rotation:a.angle}),h=[3,2,1],p=0;p<h.length;p++){var u=h[p];c.add(new A.a.Ellipse({width:Object(d.meterToPixels)(a.width*u),height:Object(d.meterToPixels)(a.height*u),fill:0===a.color?"yellow":"blue",opacity:.5}))}this.clusterShapes[e]=c,this.clusterLayer.add(c)}else o&&(this.clusterShapes[e].destroyChildren(),this.clusterShapes[e].destroy(),delete this.clusterShapes[e]);this.clusterHashes[e]=a.hash}for(var v in this.clusterShapes)t.hasOwnProperty(v)||(this.clusterShapes[v].destroy(),delete this.clusterShapes[v]);this.clusterLayer.batchDraw()},animateTrajectory:function(t,e){if(e!==this.lastKnownTrajectoryHash){var a=t.map(function(t){return Object(d.meterToPixels)(t)});this.shapeTrajectory.points(a),this.lastKnownTrajectoryHash=e,this.trajectoryLayer.batchDraw()}},animateStage:function(){if(null!==this.stage&&null!==this.shapeVehicle){var t=this.stage.scaleX(),e={x:this.stage.width(),y:this.stage.height()},a={x:this.shapeVehicle.x(),y:this.shapeVehicle.y()},i={x:a.x*t,y:a.y*t},s={x:this.stage.x(),y:this.stage.y()},r={x:-s.x,y:-s.y},o={x:r.x+e.x/2,y:r.y+e.y/2},n={x:i.x-o.x,y:i.y-o.y};this.stage.move({x:-n.x,y:-n.y}),this.redrawGrid(),this.stage.batchDraw()}},redrawGrid:function(){var t=this.getVisibleWorldDimensions();if(this.shapeXAxis.points([t.x,0,t.x+t.width,0]),this.shapeYAxis.points([0,t.y,0,t.y+t.height]),this.zoomLevel>.5){var e={x:100*Math.round(t.x/100)-100,y:100*Math.round(t.y/100)-100};this.shapeGrid.setPosition(e),this.shapeGrid.setSize({width:t.width+200,height:t.height+200}),this.shapeGrid.show()}else this.shapeGrid.hide()}},Y={getVisibleWorldDimensions:function(){var t=this.stage.scale();return{x:-this.stage.x()/t.x,y:-this.stage.y()/t.y,width:this.stage.width()/t.x,height:this.stage.height()/t.y}},isInVisibleWorld:function(t,e){if("object"!==(void 0===t?"undefined":c()(t))||!t.hasOwnProperty("x")||!t.hasOwnProperty("y"))throw new Error("ViewportUtil: `position` does not match the specification");if(e&&"number"!=typeof e)throw new Error("ViewportUtil: `additionalMargin` must be a number");var a=this.getVisibleWorldDimensions(),i=e||0,s={min:a.x-i,max:a.x+a.width+i},r={min:a.y-i,max:a.y+a.height+i};return t.x>=s.min&&t.x<=s.max&&t.y>=r.min&&t.y<=r.max}},W={name:"Map",data:function(){return{lastKnownVehiclePosition:{x:0,y:0},stage:null,gridLayer:null,shapeGrid:null,shapeXAxis:null,shapeYAxis:null,vehicleLayer:null,shapeVehicle:null,clusterLayer:null,clusterBaseCircles:{},clusterShapes:{},clusterHashes:{},observationsLayer:null,observationsShapes:[],trajectoryLayer:null,shapeTrajectory:null,lastKnownTrajectoryHash:0,animationStage:null,animationVehicle:null,animationTrack:null,animationMiddlePath:null,zoomStep:1.1,lastTouchDistance:null,minZoomScale:.15,maxZoomScale:5,zoomLevel:1,showVehicle:!0,showTrack:!0,showMiddlePath:!0,showGrid:!1,focusVehicle:!0}},computed:S()({},Object(n.b)(["liveStats","replay","viewDataSource"])),watch:{focusVehicle:function(t){this.animationStage&&(t?this.animationStage.start():this.animationStage.stop())},showGrid:function(t){this.gridLayer&&(t?this.gridLayer.show():this.gridLayer.hide())}},mounted:function(){var t=this,e=this.$el.querySelector("#mapWrapper");this.stage=new A.a.Stage({container:"mapWrapper",draggable:!0,width:e.offsetWidth,height:500}),this.clusterBaseCircles={yellow:[new A.a.Circle({radius:1,fill:"yellow",opacity:.5}),new A.a.Circle({radius:2,fill:"yellow",opacity:.5}),new A.a.Circle({radius:3,fill:"yellow",opacity:.5}),new A.a.Circle({radius:4,fill:"yellow",opacity:.5})],blue:[new A.a.Circle({radius:1,fill:"blue",opacity:.5}),new A.a.Circle({radius:2,fill:"blue",opacity:.5}),new A.a.Circle({radius:3,fill:"blue",opacity:.5}),new A.a.Circle({radius:4,fill:"blue",opacity:.5})]},this.gridLayer=new A.a.Layer,this.vehicleLayer=new A.a.Layer,this.clusterLayer=new A.a.Layer,this.observationsLayer=new A.a.Layer,this.trajectoryLayer=new A.a.Layer,this.stage.add(this.gridLayer),this.stage.add(this.vehicleLayer),this.stage.add(this.clusterLayer),this.stage.add(this.observationsLayer),this.stage.add(this.trajectoryLayer),this.showGrid||this.gridLayer.hide(),this.shapeXAxis=new A.a.Line({points:[0,2e3,0,-2e3],stroke:"red",strokeWidth:3}),this.shapeYAxis=new A.a.Line({points:[2e3,0,-2e3,0],stroke:"green",strokeWidth:3}),this.gridLayer.add(this.shapeXAxis,this.shapeYAxis);var a=new Image;a.onload=function(){this.shapeGrid=new A.a.Rect({fillPatternImage:a,fillPatternRepeat:"repeat",height:500,width:e.offsetWidth}),this.gridLayer.add(this.shapeGrid)}.bind(this),a.src="/static/grid.png",A.a.Image.fromURL("/static/pwd.png",function(e){e.size({width:Object(d.meterToPixels)(2.925),height:Object(d.meterToPixels)(1.395)}),e.offsetX(e.width()/2),e.offsetY(e.height()/2),e.position({x:Object(d.meterToPixels)(t.liveStats.vehicleX),y:Object(d.meterToPixels)(t.liveStats.vehicleY)}),t.shapeVehicle=e,t.vehicleLayer.add(e),t.animateStage()}),this.shapeTrajectory=new A.a.Line({points:[],stroke:"red",strokeWidth:4}),this.trajectoryLayer.add(this.shapeTrajectory),this.animationVehicle=new A.a.Animation(this.drive,[this.vehicleLayer,this.clusterLayer,this.observationsLayer,this.trajectoryLayer]),this.animationStage=new A.a.Animation(this.animateStage),this.animationVehicle.start(),this.focusVehicle&&this.animationStage.start(),this.stage.on("dragmove",function(e){t.showGrid&&t.redrawGrid()}),this.stage.attrs.container.addEventListener("mousewheel",this.performZoom.bind(this)),this.stage.attrs.container.addEventListener("wheel",this.performZoom.bind(this)),this.stage.attrs.container.addEventListener("touchmove",this.performZoomTouch),this.stage.attrs.container.addEventListener("touchend",function(e){t.lastTouchDistance=null}),window.addEventListener("load",this.resizeCanvas.bind(this)),window.addEventListener("resize",this.resizeCanvas.bind(this))},methods:S()({resizeCanvas:function(){this.stage.width(this.$el.querySelector("#mapWrapper").offsetWidth)}},Z,X,Y),components:{Switches:E}},$={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("b-row",[a("b-col",[a("div",{attrs:{id:"mapWrapper"}})])],1),t._v(" "),a("b-row",{staticClass:"mapControls",attrs:{"align-h":"center"}},[a("b-col",{staticClass:"controlsCol",attrs:{cols:"auto",sm:"auto"}},[a("div",{staticClass:"controlsFrame"},[a("switches",{attrs:{theme:"fsd",label:"Show Grid"},model:{value:t.showGrid,callback:function(e){t.showGrid=e},expression:"showGrid"}})],1)]),t._v(" "),a("b-col",{staticClass:"controlsCol",attrs:{cols:"auto",sm:"auto"}},[a("div",{staticClass:"controlsFrame"},[a("label",[t._v("Zoom Level")]),t._v(" "),a("code",[t._v(t._s(t.zoomLevel))])])]),t._v(" "),a("b-col",{staticClass:"controlsCol",attrs:{cols:"auto",sm:"auto"}},[a("div",{staticClass:"controlsFrame"},[a("switches",{attrs:{theme:"fsd",label:"Focus Vehicle"},model:{value:t.focusVehicle,callback:function(e){t.focusVehicle=e},expression:"focusVehicle"}})],1)])],1)],1)},staticRenderFns:[]};var z=a("VU/8")(W,$,!1,function(t){a("sJTS")},null,null).exports,B={name:"DashboardView",data:function(){return{transportMode:"live",transportPosition:0,activeClip:null}},computed:Object(n.b)({liveStats:"liveStats"}),watch:{$route:function(t,e){t.path.split("/").indexOf("live")>=0&&this.$store.dispatch("startRefreshingEntity","liveStats")}},created:function(){this.$route.path.split("/").indexOf("live")>=0&&this.$store.dispatch("startRefreshingEntity","liveStats")},destroyed:function(){this.$store.dispatch("stopRefreshingEntity","liveStats")},components:{RecordingControls:C,ReplayControls:T,Map:z}},K={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("router-view",{attrs:{name:"transportControls"}}),this._v(" "),e("router-view",{attrs:{name:"map"}}),this._v(" "),e("router-view",{attrs:{name:"cards"}})],1)},staticRenderFns:[]},U=a("VU/8")(B,K,!1,null,null,null).exports,N={name:"RecordingsView",data:function(){return{loading:!1,fields:[{key:"_id",label:"ID"},{key:"start",label:"Started at",formatter:function(t,e,a){var i=new Date(t);return h.a.padZeros(2,i.getDate())+"."+h.a.padZeros(2,i.getMonth())+"."+i.getFullYear()+" - "+h.a.padZeros(2,i.getHours())+":"+h.a.padZeros(2,i.getMinutes())+":"+h.a.padZeros(2,i.getSeconds())}},{key:"duration",label:"Duration",formatter:function(t,e,a){return a.end?h.a.timerFormat(a.end-a.start):"- not finished -"}}]}},computed:Object(n.b)({recordings:"recordings"}),mounted:function(){this.reload()},methods:{reload:function(){var t=this;this.loading=!0,this.$store.dispatch("fetchRecordings").then(function(e){t.loading=!1},function(t){console.log(t)})}}},J={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("b-row",[i("b-col",[i("h1",[t._v("Select a clip to replay")])])],1),t._v(" "),i("b-row",{attrs:{"align-h":"between"}},[i("b-col",{attrs:{"align-self":"center"}},[t.loading?i("b-progress",{attrs:{max:100,height:"20px",variant:"fsd-red",animated:""}},[i("b-progress-bar",{attrs:{value:100}},[i("strong",[t._v("Loading clips...")])])],1):t._e()],1),t._v(" "),i("b-col",{attrs:{cols:"auto"}},[i("b-button",{attrs:{variant:"secondary",disabled:t.loading},on:{click:t.reload}},[i("img",{attrs:{src:a("IXiI"),width:"16"}})])],1)],1),t._v(" "),i("b-row",[i("b-col",[i("b-table",{attrs:{items:t.recordings,fields:t.fields,id:"clipList","thead-class":"thead-fsd","tbody-class":"tbody-fsd",hover:"",fixed:""},scopedSlots:t._u([{key:"_id",fn:function(e){return i("span",{},[i("router-link",{attrs:{to:"/dashboard/replay/"+e.value}},[t._v(t._s(e.value))])],1)}}])})],1)],1)],1)},staticRenderFns:[]};var q=a("VU/8")(N,J,!1,function(t){a("d/ak")},null,null).exports,Q={name:"CardsLive",data:function(){return{}},computed:Object(n.b)({liveStats:"liveStats",liveStatsFiltered:function(){var t=u.a.getConfigFromIdentifier("liveStats").requiredProperties,e=this.liveStats,a={};for(var i in e)t.indexOf(i)>=0&&(a[i]=e[i]);return a}})},tt={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("b-row",[a("b-col",{attrs:{md:"6",lg:"4"}},[a("b-card",{attrs:{title:"Live stats"}},[a("p",{staticClass:"card-text"},[a("pre",[t._v("timestamp: "+t._s(t.liveStatsFiltered.timestamp)+"\nsteerAngle: "+t._s(t.liveStatsFiltered.steerAngle)+"\npathMiddleX: "+t._s(t.liveStatsFiltered.pathMiddleX)+"\npathMiddleY: "+t._s(t.liveStatsFiltered.pathMiddleY)+"\nvehicleX: "+t._s(t.liveStatsFiltered.vehicleX)+"\nvehicleY: "+t._s(t.liveStatsFiltered.vehicleY)+"\nvehicleVelocityX: "+t._s(t.liveStatsFiltered.vehicleVelocityX)+"\nvehicleVelocityY: "+t._s(t.liveStatsFiltered.vehicleVelocityY)+"\nvehicleRotation: "+t._s(t.liveStatsFiltered.vehicleRotation)+"\nfrontwheelLeftRotation: "+t._s(t.liveStatsFiltered.frontwheelLeftRotation)+"\nfrontwheelRightRotation: "+t._s(t.liveStatsFiltered.frontwheelRightRotation)+"\n        ")])])])],1),t._v(" "),a("b-col",{attrs:{md:"6",lg:"4"}},[a("b-card",{attrs:{title:"Observations"}},[a("p",{staticClass:"card-text"},[a("pre",[t._v(t._s(t.liveStatsFiltered.observations))])])])],1),t._v(" "),a("b-col",{attrs:{md:"6",lg:"4"}},[a("b-card",{attrs:{title:"Trajectory"}},[a("p",{staticClass:"card-text"},[a("pre",[t._v(t._s(t.liveStatsFiltered.trajectory))])])])],1)],1)},staticRenderFns:[]},et=a("VU/8")(Q,tt,!1,null,null,null).exports,at={name:"CardsReplay",data:function(){return{}},computed:Object(n.b)({replayGlobals:"replay"})},it={render:function(){var t=this.$createElement,e=this._self._c||t;return e("b-row",[e("b-card-group",{attrs:{columns:""}},[e("b-card",{attrs:{title:"Stats"}},[e("p",{staticClass:"card-text"},[e("code",[this._v("\n          "+this._s(this.replayGlobals.activeFrame)+"\n        ")])])])],1)],1)},staticRenderFns:[]},st=a("VU/8")(at,it,!1,null,null,null).exports;i.a.use(o.a);var rt=new o.a({routes:[{path:"/",redirect:"/dashboard/live"},{path:"/dashboard",name:"dashboard",component:U,props:{recording:!0},children:[{path:"live",components:{transportControls:C,map:z,cards:et}},{path:"replay/:clipID",components:{transportControls:T,map:z,cards:st},props:{transportControls:!0}}]},{path:"/recordings",name:"recordings",component:q}]});rt.beforeEach(function(t,e,a){t.path.split("/").indexOf("live")>=0?w.commit("updateViewDataSource","live"):w.commit("updateViewDataSource","replay"),a()});var ot=rt,nt={name:"status-light",props:{active:Boolean,label:String,color:String},computed:{style:function(){return this.active?"background-color: "+this.color+";":"background: transparent; border: 1px solid gray;"}}},lt={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("span",[this._v(this._s(this.label))]),this._v(" "),e("span",{style:this.style,attrs:{id:"light"}})])},staticRenderFns:[]};var ct=a("VU/8")(nt,lt,!1,function(t){a("N3eC")},"data-v-f610b894",null).exports,dt={name:"App",data:function(){return{}},computed:Object(n.b)({appState:"appState",globalLoader:"globalLoader"}),created:function(){this.$store.dispatch("startRefreshingEntity","appState")},components:{StatusLight:ct}},ht={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("b-navbar",{attrs:{toggleable:"md",type:"dark",variant:"fsd"}},[i("b-navbar-toggle",{attrs:{target:"navbarCollapse"}}),t._v(" "),i("b-navbar-brand",{attrs:{href:"/#/"}},[t._v("Driverless Cockpit")]),t._v(" "),i("b-collapse",{attrs:{"is-nav":"",id:"navbarCollapse"}},[i("b-navbar-nav",[i("b-nav-item",{attrs:{to:"/recordings"}},[i("b-button",{attrs:{variant:"primary",size:"sm"}},[i("img",{staticClass:"replay-icon",attrs:{src:a("qltc"),width:"10"}}),t._v(" Replay\n          ")])],1)],1),t._v(" "),i("b-navbar-nav",{staticClass:"ml-auto"},[i("b-nav-item",{attrs:{to:"/dashboard/live"}},[i("status-light",{attrs:{label:"Recording",active:t.appState.recording,color:"rgba(190,22,33,1)"}})],1),t._v(" "),i("b-nav-item",[i("status-light",{attrs:{label:"Connected",active:t.appState.connected,color:"lightgreen"}})],1)],1)],1)],1),t._v(" "),i("b-container",[i("router-view")],1),t._v(" "),i("b-modal",{ref:"globalLoader",attrs:{"no-close-on-esc":"","no-close-on-backdrop":"","hide-header-close":""},model:{value:t.globalLoader.show,callback:function(e){t.$set(t.globalLoader,"show",e)},expression:"globalLoader.show"}},[i("div",{attrs:{slot:"modal-header"},slot:"modal-header"}),t._v(" "),i("h3",[t._v(t._s(t.globalLoader.message))]),t._v(" "),i("div",{attrs:{slot:"modal-footer"},slot:"modal-footer"})])],1)},staticRenderFns:[]};var pt=a("VU/8")(dt,ht,!1,function(t){a("PkTK")},null,null).exports;a("Jmt5"),a("9M+g"),a("Fphx");i.a.config.productionTip=!1,i.a.use(s.a),i.a.use(r.a),i.a.http.options.root="/",new i.a({el:"#app",store:w,router:ot,components:{App:pt},template:"<App/>"})},PkTK:function(t,e){},V8gR:function(t,e){var a={requiredProperties:["activeRecording","connected","recording","presentationMode"],refreshInterval:500},i={requiredProperties:["timestamp","steerAngle","pathMiddleX","pathMiddleY","vehicleX","vehicleY","vehicleVelocityX","vehicleVelocityY","vehicleRotation","frontwheelLeftRotation","frontwheelRightRotation","observations","clusters","trajectory","trajectoryHash","trajectoryPrimitives"],refreshInterval:100};t.exports={getStateObjectFromIdentifier:function(t,e){switch(e){case"appState":return t.appState;case"liveStats":return t.liveStats;default:throw new Error("Unknown entity identifier: "+e)}},getApiRouteFromIdentifier:function(t){switch(t){case"appState":return"appstate";case"liveStats":return"livestats";case"start":return"recording/start";case"stop":return"recording/stop";default:throw new Error("Unknown entity identifier: "+t)}},getConfigFromIdentifier:function(t){switch(t){case"appState":return a;case"liveStats":return i;default:throw new Error("Unknown entity identifier: "+t)}}}},XySv:function(t,e){},"d/ak":function(t,e){},fYSq:function(t,e){},frZY:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIKICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoKICA8bGluZSB4MT0iMSIgeTE9IjEiIHgyPSIxMSIgeTI9IjExIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIC8+CiAgPGxpbmUgeDE9IjExIiB5MT0iMSIgeDI9IjEiIHkyPSIxMSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiAvPgo8L3N2Zz4K"},qltc:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIKICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoKICA8cG9seWdvbiBwb2ludHM9IjAsMCAxMSw2IDAsMTIiIGZpbGw9IndoaXRlIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+Cjwvc3ZnPgo="},sJTS:function(t,e){},zj2Q:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.ac4fd4dbdc6e9f810b15.js.map