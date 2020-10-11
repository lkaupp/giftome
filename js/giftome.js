let searchParams = new URLSearchParams(window.location.search)
let pdfDoc = undefined;
$('#to').text(searchParams.get('to'));
$('#from').text(searchParams.get('from'));
$('#pageContainer').hide();

if (!pdfjsLib.getDocument || !pdfjsViewer.PDFPageView) {
    alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
}

// The workerSrc property shall be specified.
//
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "../../node_modules/pdfjs-dist/build/pdf.worker.js";

$('#uncrypt').click(() => {
    var loadingTask = pdfjsLib.getDocument({
        url: '/doc/ozumli.pdf',
        password: $('#pw').val(),
    });
    var container = document.getElementById("pageContainer");
    var eventBus = new pdfjsViewer.EventBus();
    loadingTask.promise.then(function (pdfDocument) {
        pdfDoc = pdfDocument;
        // Document loaded, retrieving the page.
        return pdfDocument.getPage(1).then(function (pdfPage) {
            // Creating the page view with default parameters.
            var pdfPageView = new pdfjsViewer.PDFPageView({
                container: container,
                id: 1,
                scale: 1.0,
                defaultViewport: pdfPage.getViewport({scale: 1.0}),
                eventBus: eventBus,
                // We can enable text/annotations layers, if needed
                textLayerFactory: new pdfjsViewer.DefaultTextLayerFactory(),
                annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
            });
            // Associates the actual page with the view, and drawing it
            pdfPageView.setPdfPage(pdfPage);
            $('#pageContainer').show();
            return pdfPageView.draw();
        });
    })

});

$('#pageContainer').click(()=>{
    if(pdfDoc !== undefined)
        pdfDoc.destroy();
    $('#pageContainer').hide();
    $('#pageContainer').empty();
});
