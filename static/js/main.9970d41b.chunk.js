(this.webpackJsonpgiffy=this.webpackJsonpgiffy||[]).push([[0],{141:function(e,t,n){e.exports=n(186)},146:function(e,t,n){},148:function(e,t,n){},186:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),i=n(11),o=n.n(i),c=(n(146),n(25)),u=n.n(c),s=n(17),l=n(48),d=(n(148),n(6)),h=n(84),p=n.n(h),m=function(e,t,n,r,a,i,o,c){var u=document.createElement("canvas");u.width=i,u.height=o;var s=u.getContext("2d"),l=Date.now(),d=l,h=[],m=[];e.play(),e.onloadeddata=function(){l=Date.now(),function u(){var g=Date.now()-d;if(g>100){null===s||void 0===s||s.drawImage(e,t,n,r,a,0,0,i,o);var f=null===s||void 0===s?void 0:s.getImageData(0,0,i,o);d=Date.now(),h.push(null===f||void 0===f?void 0:f.data),m.push(g)}!e.paused&&Date.now()-l<3e4?requestAnimationFrame(u):c(p.a.encode(h,i,o,255,m))}()}},g=n(85),f=n.n(g),v=n(86),b=n.n(v),E=function(e){var t=e.state,n=e.dispatch,r=e.startCapture,i=e.stopCapture,o=e.durationSecs,c=e.onExportGif,u=e.onExportPng,s=e.progress,l=btoa(new Uint8Array(t.png).reduce((function(e,t){return e+String.fromCharCode(t)}),""));return a.a.createElement(d.Navbar,null,a.a.createElement(d.NavbarGroup,null,a.a.createElement(d.NavbarHeading,null,a.a.createElement("h3",null,"screencatcher")),a.a.createElement(d.Button,{disabled:t.isRecording,onClick:r,icon:"record"},"Record"),a.a.createElement(d.Button,{disabled:!t.isRecording,onClick:i,icon:"stop"},"Stop")),a.a.createElement(d.NavbarGroup,{align:d.Alignment.RIGHT},a.a.createElement(d.Button,{icon:"zoom-to-fit",onClick:function(){return n({type:"startCropping"})}},"Crop (PNG Only)"),a.a.createElement(d.NavbarDivider,null),a.a.createElement(d.Popover,{minimal:!0,content:a.a.createElement(d.Menu,null,a.a.createElement(d.MenuItem,{text:"Export to PNG",disabled:t.isConverting,onClick:u}),a.a.createElement(d.MenuItem,{text:"Export to GIF",disabled:t.isConverting,onClick:c}),a.a.createElement(d.MenuDivider,null),a.a.createElement(d.MenuItem,{text:"Image Width"},[256,512,1024,2048].map((function(e){return a.a.createElement(d.MenuItem,{key:e,text:"".concat(e),icon:t.gifWidth===e?"tick":null,onClick:function(){return n({type:"setGifWidth",width:e})}})}))))},a.a.createElement(d.Button,{icon:"export",text:"Export..."})),(t.png||t.gif)&&a.a.createElement(d.Popover,{minimal:!0,content:a.a.createElement(d.Menu,null,a.a.createElement(d.MenuItem,{text:"Download PNG",download:"screencatcher.png",href:"data:image/png;base64,".concat(l),target:"_blank",icon:"download",disabled:!t.png}),a.a.createElement(d.MenuItem,{text:"Download GIF",download:"screencatcher.gif",href:t.gif,target:"_blank",icon:"download",disabled:!t.gif}))},a.a.createElement(d.Button,{icon:"download",text:"Download..."})),t.isConverting&&a.a.createElement(a.a.Fragment,null,a.a.createElement(d.NavbarDivider,null),a.a.createElement("div",{style:{width:"10rem"}},a.a.createElement(d.ProgressBar,{value:s}))),a.a.createElement(d.NavbarDivider,null),"Duration: ",b()(o>0?o:0).format("0.0"),"s"))},w=n(91),C=n(33),y=n.n(C),x=Object(w.a)((function(e){return a.a.createElement("div",{ref:e.getRef,style:{position:"absolute",left:e.x,top:e.y,width:e.width,height:e.height,touchAction:"none",borderWidth:5,borderColor:"red",borderStyle:"solid",pointerEvents:"all"}},a.a.createElement("div",{style:{width:"100%",height:"100%"}},e.x,",",e.y,",",e.width,",",e.height," ",a.a.createElement(d.Button,{onClick:function(){return e.onCrop([e.x,e.y,e.width,e.height])}},"Crop"),a.a.createElement(d.Button,{onClick:function(){return e.onCropCancel()}},"Cancel")))})),k=function(e){var t=e.onCrop,n=e.onCancel,r=a.a.useState({x:0,y:0,width:300,height:200}),i=Object(s.a)(r,2),o=i[0],c=i[1];return a.a.createElement(x,Object.assign({onCrop:t,onCropCancel:n,resizable:{edges:{left:!0,right:!0,bottom:!0,top:!0},modifiers:[y.a.modifiers.restrictRect({restriction:"parent"})]},draggable:{modifiers:[y.a.modifiers.restrictRect({restriction:"parent"})]},onDragMove:function(e){return c((function(t){return{x:t.x+e.dx,y:t.y+e.dy,width:t.width,height:t.height}}))},onResizeMove:function(e){var t=e.rect,n=t.width,r=t.height,a=e.deltaRect,i=a.left,o=a.top;c((function(e){return{x:e.x+i,y:e.y+o,width:n,height:r}}))}},o))},O=function(e){var t=e.chunksUrl;return a.a.createElement("video",{autoPlay:!0,controls:!0,style:{maxHeight:"100%",height:"100%",maxWidth:"100%",width:"100%"},src:t||void 0})},j=n(92),D=n(19),R={chunks:[],chunksUrl:"",isRecording:!1,isConverting:!1,screenDimensions:null,png:null,gif:null,gifWidth:1024,isCropping:!1,cropDimensions:null},M=function(e,t){switch(t.type){case"startRecording":return Object(D.a)({},e,{isRecording:!0});case"recordChunk":return Object(D.a)({},e,{chunks:[].concat(Object(j.a)(e.chunks),[t.chunk])});case"stopRecording":return Object(D.a)({},e,{isRecording:!1,chunksUrl:URL.createObjectURL(e.chunks[0]),screenDimensions:[t.captureStream.getVideoTracks()[0].getSettings().width,t.captureStream.getVideoTracks()[0].getSettings().height]});case"startExport":return Object(D.a)({},e,{isConverting:!0});case"endExport":return Object(D.a)({},e,{isConverting:!1,png:t.png,gif:t.gif});case"setGifWidth":return Object(D.a)({},e,{gifWidth:t.width});case"startCropping":return Object(D.a)({},e,{isCropping:!0});case"endCropping":return Object(D.a)({},e,{isCropping:!1,cropDimensions:t.dimensions?t.dimensions:e.cropDimensions})}return e};function S(e){return I.apply(this,arguments)}function I(){return(I=Object(l.a)(u.a.mark((function e(t){var n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=null,e.prev=1,e.next=4,navigator.mediaDevices.getDisplayMedia(t);case 4:n=e.sent,e.next=11;break;case 7:return e.prev=7,e.t0=e.catch(1),console.error("Error: "+e.t0),e.abrupt("return",null);case 11:return e.abrupt("return",n);case 12:case"end":return e.stop()}}),e,null,[[1,7]])})))).apply(this,arguments)}var W={video:{cursor:"always"},audio:!1},G=function(){var e,t,n=Object(r.useReducer)(M,R),i=Object(s.a)(n,2),o=i[0],c=i[1],h=Object(r.useState)(null),p=Object(s.a)(h,2),g=p[0],v=p[1],b=Object(r.useState)(null),w=Object(s.a)(b,2),C=w[0],y=w[1],x=Object(r.useState)(null),j=Object(s.a)(x,2),D=j[0],I=j[1],G=Object(r.useState)(Date.now()),N=Object(s.a)(G,2),B=N[0],P=N[1],U=Object(r.useState)(0),F=Object(s.a)(U,2),H=F[0],z=F[1],A=function(){var e=Object(l.a)(u.a.mark((function e(){var t,n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S(W);case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return");case 5:n=new MediaRecorder(t),c({type:"startRecording"}),n.ondataavailable=function(e){return c({type:"recordChunk",chunk:e.data})},n.onstop=function(){c({type:"stopRecording",captureStream:t})},n.start(),y(Date.now()),v(n);case 12:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),L=function(){var e=Object(l.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:g.stop(),I(Date.now());case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),T=Object(r.useRef)(),q=function(e){var t=function(){return{width:e.current.offsetWidth,height:e.current.offsetHeight}},n=Object(r.useState)({width:0,height:0}),a=Object(s.a)(n,2),i=a[0],o=a[1];return Object(r.useEffect)((function(){var n=function(){o(t())};return e.current&&o(t()),window.addEventListener("resize",n),function(){window.removeEventListener("resize",n)}}),[e]),i}(T),J=q.width,V=q.height,_=null===(e=o.screenDimensions)||void 0===e?void 0:e[0],$=null===(t=o.screenDimensions)||void 0===t?void 0:t[1],K=J/V,Q=_/$,X=0,Y=0,Z=J,ee=V;if(Q>K){var te=J/_*$;Y=.5*(V-te),ee=te}else if(K>Q){var ne=V/$*_;X=.5*(J-ne),Z=ne}Object(r.useEffect)((function(){setTimeout((function(){return P(Date.now())}),1e3)}),[B]);var re=((D||B)-(C||B))/1e3;return a.a.createElement("div",{className:"App"},a.a.createElement("main",{className:"bp3-dark"},a.a.createElement(E,{state:o,dispatch:c,durationSecs:re,onExportGif:function(){c({type:"startExport"}),function(e,t,n,r,a,i,o,c){var u=c/r*a,s=1*(n-t),l=Math.trunc(5*s/1e3);o(0),f.a.createGIF({video:e,gifWidth:c,gifHeight:u,numFrames:l,interval:.2,frameDuration:2,progressCallback:o},(function(e){if(!e.error){var t=e.image;i(t)}}))}(o.chunks,C,D,_,$,(function(e){return c({type:"endExport",gif:e})}),z,o.gifWidth)},onExportPng:function(){var e=document.createElement("video");e.src=o.chunksUrl,e.width=_,e.height=$,c({type:"startExport"});var t=1*_/J,n=1*$/V,r=o.cropDimensions;m(e,r?Math.round(r[0]*t):0,r?Math.round(r[1]*n):0,r?Math.round(r[2]*t):_,r?Math.round(r[3]*n):$,r?Math.round(r[2]*t):o.gifWidth,r?Math.round(r[3]*n):$*o.gifWidth/_,(function(e){return c({type:"endExport",png:e})}))},progress:H,startCapture:A,stopCapture:L}),a.a.createElement("div",{style:{height:"calc(100vh - 50px)",maxHeight:"calc(100vh - 50px)",width:"100vw",maxWidth:"100vw",padding:"1rem",backgroundColor:"#293742"}},a.a.createElement("div",{style:{width:"100%",maxWidth:"100%",height:"100%",maxHeight:"100%",position:"relative"},ref:T},a.a.createElement("div",{style:{position:"absolute",left:X,top:Y,width:Z,height:ee,pointerEvents:"none"}},o.isCropping&&a.a.createElement(k,{onCrop:function(e){return c({type:"endCropping",dimensions:e})},onCancel:function(){return c({type:"endCropping"})}})),o.chunksUrl?a.a.createElement(O,{chunksUrl:o.chunksUrl}):a.a.createElement(d.NonIdealState,{title:a.a.createElement(a.a.Fragment,null,a.a.createElement("p",null,"screencatcher lets you record your desktop to an animated GIF or PNG.")),description:a.a.createElement(a.a.Fragment,null,a.a.createElement("p",null,"It works entirely from your browser so doesn't require any other applications to be installed and doesn't share data with the outside world.")),icon:"mobile-video",action:o.isRecording?void 0:a.a.createElement(d.Button,{onClick:A,icon:"record"},"Click here to start recording")})))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(184),n(185);o.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(G,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[141,1,2]]]);
//# sourceMappingURL=main.9970d41b.chunk.js.map