function setPixel(imageData, x, y, r, g, b, a) {
	//utility canvas function for drawing a pixel
	var index = (x + y * imageData.width) * 4;
	imageData.data[index+0] = r;
	imageData.data[index+1] = g;
	imageData.data[index+2] = b;
	imageData.data[index+3] = a;
}
	
function daylightMap(element, currentdate, offset) {

	var c = element.getContext("2d");

	// read the width and height of the canvas
	var width = element.width;
	var height = element.height;

	// create a new pixel array
	var imageData = c.createImageData(width, height);

	//time
	var seconds = currentdate.getUTCHours()*60*60 + currentdate.getUTCMinutes()*60 + currentdate.getUTCSeconds();
	seconds += offset;

	var start = new Date(currentdate.getFullYear(), 0, 0);
	var diff = currentdate - start;
	var oneDay = 1000 * 60 * 60 * 24;
	var day = diff / oneDay;

	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			//calculates the cross-product of the direction of the sun against
			//a sphere representing Earth.
			var p1 = Math.cos(2*Math.PI*x/width)*Math.sin(Math.PI*y/height);
			var p2 = Math.sin(-2*Math.PI*x/width)*Math.sin(Math.PI*y/height);
			var p3 = Math.cos(Math.PI*y/height);
			var d1 = Math.cos(2*Math.PI*seconds/24/60/60);
			var d2 = Math.sin(2*Math.PI*seconds/24/60/60);
			var d3 = Math.tan(2*Math.PI*(23.5)/360*Math.cos(2*Math.PI/365*(day-172)))
			var brightness = p1*d1 + p2*d2 + p3*d3;

			if (brightness > 0.99) {
				setPixel(imageData, x, y, 0, 0, 0, 50 - 3000*(brightness-0.99));
			} else if(brightness < -0.2 ) {
				setPixel(imageData, x, y, 0, 0, 0, 200);
			} else if(brightness > 0.1) {
				setPixel(imageData, x, y, 0, 0, 0, 50);
			} else {
				setPixel(imageData, x, y, 0, 0, 0, 200-75*(1-Math.cos(10*Math.PI/3*brightness + 2/3*Math.PI)));
			}	
		}
	}
	// copy the image data back onto the canvas
	c.putImageData(imageData, 0, 0); // at coords 0,0

}
