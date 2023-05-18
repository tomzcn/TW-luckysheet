(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";

  exports.name = "tw-luckysheet-event-handler";
  exports.platforms = ["browser"];
  exports.after = ["startup"];

  exports.startup = function () {
    $tw.rootWidget.addEventListener(
      "tm-luckysheet-start",
      async function (event) {
        var unboundGetTiddlerData = $tw.Wiki.prototype.getTiddlerData;
        var data = unboundGetTiddlerData.call(
          $tw.wiki,
          "$:/plugins/tomzheng/luckysheet/data.json",
          {}
        );
        data = JSON.stringify(data);
        //console.log(data);

        var s1 = `
        
        <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/css/pluginsCss.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/plugins.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/luckysheet/dist/css/luckysheet.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/luckysheet/dist/assets/iconfont/iconfont.css"
    />
    <script src="https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/js/plugin.js">\x3C/script>
    <script src="https://cdn.jsdelivr.net/npm/luckysheet/dist/luckysheet.umd.js">\x3C/script>
    
     <body style="margin:0px;">
     <div
            id="luckysheet"
            style="width:1024px;height:768px;margin:0px;padding:0px;left:0px;right:0px;"
            ></div>
    <a id="a1" onclick="save()"></a>
    </body>
    
    <script>

    
      var save = function() {
        var messageBox = document.getElementById("luckysheet-message-box");
        if(messageBox) {
          var data=luckysheet.getAllSheets();
          data=JSON.stringify(data);

          // Create the message element and put it in the message box
          var message = document.createElement("div");
          message.setAttribute("data",data);
          messageBox.appendChild(message);
          // Create and dispatch the custom event to the extension
          var event = document.createEvent("Events");
          event.initEvent("luckysheet-save-file",true,false);
          message.dispatchEvent(event);
          return true;
        } else {
          return false;
        }
      };

      $(function () {
        var options = {
          container: "luckysheet",
          row:10,
          column:5,
          // showtoolbar: false,
          // showinfobar: false,
          // showsheetbar: false,
          // sheetFormulaBar:false,
          // showstatisticBar:false,
          // enableAddRow:false,
          // enableAddBackTop:false,
          data: ${data},
        };
        //console.log(JSON.stringify(options));
        luckysheet.create(options);
      });
    
      \x3C/script>
            `;

        var luckysheetdiv = document.getElementById("luckysheetdiv");
        // var iframe=document.createElement('iframe');
        var iframe = document.getElementById("luckysheet-iframe");
        // iframe.style = "width:400px;height:400px;";
        const blob = new Blob([s1], { type: "text/html" }); // create Blob object
        const url = URL.createObjectURL(blob); // create URL for Blob
        iframe.src = url; // set href attribute to URL
        // luckysheetdiv.appendChild(iframe); // append link to document
      }
    );

    $tw.rootWidget.addEventListener(
      "tm-luckysheet-save",
      async function (event) {
        var iframe = document.getElementById("luckysheet-iframe");

        // Helper to enable TiddlyFox-style saving for a window
        var enableSaving = function (doc) {
          // alert('enable')
          // Create the message box
          var messageBox = doc.createElement("div");
          messageBox.id = "luckysheet-message-box";

          doc.body.appendChild(messageBox);
          // Listen for save events
          messageBox.addEventListener(
            "luckysheet-save-file",
            function (event) {
              // alert('message')
              // Get the details from the message
              var message = event.target,
                data = message.getAttribute("data");

              var unboundSetTiddlerData =
                window.$tw.Wiki.prototype.setTiddlerData;
              unboundSetTiddlerData.call(
                window.$tw.wiki,
                "$:/plugins/tomzheng/luckysheet/data.json",
                JSON.parse(data),
                {}
              );

              // Remove the message element from the message box
              message.parentNode.removeChild(message);
              return false;
            },
            false
          );
        };

        enableSaving(iframe.contentDocument);

        var iframe = document.getElementById("luckysheet-iframe");
        iframe.contentDocument.getElementById("a1").click();
      }
    );
  };

  //end
})();
