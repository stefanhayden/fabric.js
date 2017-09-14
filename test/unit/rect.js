(function() {

  var REFERENCE_RECT = {
    'type':                     'rect',
    'originX':                  'left',
    'originY':                  'top',
    'left':                     0,
    'top':                      0,
    'width':                    0,
    'height':                   0,
    'fill':                     'rgb(0,0,0)',
    'stroke':                   null,
    'strokeWidth':              1,
    'strokeDashArray':          null,
    'strokeLineCap':            'butt',
    'strokeLineJoin':           'miter',
    'strokeMiterLimit':         10,
    'scaleX':                   1,
    'scaleY':                   1,
    'angle':                    0,
    'flipX':                    false,
    'flipY':                    false,
    'opacity':                  1,
    'shadow':                   null,
    'visible':                  true,
    'backgroundColor':          '',
    'clipTo':                   null,
    'fillRule':                 'nonzero',
    'paintFirst':               'fill',
    'globalCompositeOperation': 'source-over',
    'transformMatrix':          null,
    'rx':                       0,
    'ry':                       0,
    'skewX':                    0,
    'skewY':                    0,
  };

  QUnit.module('fabric.Rect');

  test('constructor', function(){
    ok(fabric.Rect);

    var rect = new fabric.Rect();

    ok(rect instanceof fabric.Rect);
    ok(rect instanceof fabric.Object);

    deepEqual(rect.get('type'), 'rect');
  });

  test('complexity', function() {
    var rect = new fabric.Rect();

    ok(typeof rect.complexity == 'function');
  });

  test('cache properties', function() {
    var rect = new fabric.Rect();

    ok(rect.cacheProperties.indexOf('rx') > -1, 'rx is in cacheProperties array');
    ok(rect.cacheProperties.indexOf('ry') > -1, 'ry is in cacheProperties array');
  });

  test('toObject', function() {
    var rect = new fabric.Rect();
    ok(typeof rect.toObject == 'function');

    var object = rect.toObject();
    deepEqual(object, REFERENCE_RECT);
  });

  asyncTest('fabric.Rect.fromObject', function() {
    ok(typeof fabric.Rect.fromObject == 'function');

    fabric.Rect.fromObject(REFERENCE_RECT, function(rect) {
      ok(rect instanceof fabric.Rect);
      deepEqual(rect.toObject(), REFERENCE_RECT);

      var expectedObject = fabric.util.object.extend({ }, REFERENCE_RECT);
      expectedObject.fill = {'type': 'linear','coords': {'x1': 0,'y1': 0,'x2': 200,'y2': 0},'colorStops': [{'offset': '0','color': 'rgb(255,0,0)','opacity': 1},{'offset': '1','color': 'rgb(0,0,255)','opacity': 1}],'offsetX': 0,'offsetY': 0};
      expectedObject.stroke = {'type': 'linear','coords': {'x1': 0,'y1': 0,'x2': 200,'y2': 0},'colorStops': [{'offset': '0','color': 'rgb(255,0,0)','opacity': 1},{'offset': '1','color': 'rgb(0,0,255)','opacity': 1}],'offsetX': 0,'offsetY': 0};
      fabric.Rect.fromObject(expectedObject, function(rect2) {
        ok(rect2.fill instanceof fabric.Gradient);
        ok(rect2.stroke instanceof fabric.Gradient);
        start();
      });
    });
  });

  asyncTest('fabric.Rect.fromObject with pattern fill', function() {
    var fillObj = {
      type: 'pattern',
      source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='
    };
    fabric.Rect.fromObject({ fill: fillObj }, function(rect) {
      ok(rect.fill instanceof fabric.Pattern);
      start();
    });
  });

  test('fabric.Rect.fromElement', function() {
    ok(typeof fabric.Rect.fromElement == 'function');

    var elRect = fabric.document.createElement('rect');
    fabric.Rect.fromElement(elRect, function(rect) {
      var expectedObject = fabric.util.object.extend({ }, REFERENCE_RECT);
      expectedObject.visible = false;
      ok(rect instanceof fabric.Rect);
      deepEqual(rect.toObject(), expectedObject);
    });
  });

  test('fabric.Rect.fromElement with custom attributes', function() {
    var elRectWithAttrs = fabric.document.createElement('rect');

    elRectWithAttrs.setAttribute('x', 10);
    elRectWithAttrs.setAttribute('y', 20);
    elRectWithAttrs.setAttribute('width', 222);
    elRectWithAttrs.setAttribute('height', 333);
    elRectWithAttrs.setAttribute('rx', 11);
    elRectWithAttrs.setAttribute('ry', 12);
    elRectWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
    elRectWithAttrs.setAttribute('opacity', 0.45);
    elRectWithAttrs.setAttribute('stroke', 'blue');
    elRectWithAttrs.setAttribute('stroke-width', 3);
    elRectWithAttrs.setAttribute('stroke-dasharray', '5, 2');
    elRectWithAttrs.setAttribute('stroke-linecap', 'round');
    elRectWithAttrs.setAttribute('stroke-linejoin', 'bevil');
    elRectWithAttrs.setAttribute('stroke-miterlimit', 5);
    //elRectWithAttrs.setAttribute('transform', 'translate(-10,-20) scale(2) rotate(45) translate(5,10)');

    fabric.Rect.fromElement(elRectWithAttrs, function(rectWithAttrs) {
      ok(rectWithAttrs instanceof fabric.Rect);
      var expectedObject = fabric.util.object.extend(REFERENCE_RECT, {
        left:             10,
        top:              20,
        width:            222,
        height:           333,
        fill:             'rgb(255,255,255)',
        opacity:          0.45,
        stroke:           'blue',
        strokeWidth:      3,
        strokeDashArray:  [5, 2],
        strokeLineCap:    'round',
        strokeLineJoin:   'bevil',
        strokeMiterLimit: 5,
        rx:               11,
        ry:               12
      });
      deepEqual(rectWithAttrs.toObject(), expectedObject);
    });
  });

  test('empty fromElement', function() {
    fabric.Rect.fromElement(null, function(rect) {
      equal(rect, null);
    });
  });

  test('clone with rounded corners', function() {
    var rect = new fabric.Rect({ width: 100, height: 100, rx: 20, ry: 30 });
    rect.clone(function(clone) {
      equal(clone.get('rx'), rect.get('rx'));
      equal(clone.get('ry'), rect.get('ry'));
    });
  });

  test('toSVG with rounded corners', function() {
    var rect = new fabric.Rect({ width: 100, height: 100, rx: 20, ry: 30, strokeWidth: 0 });
    var svg = rect.toSVG();

    equal(svg, '<rect x="-50" y="-50" rx="20" ry="30" width="100" height="100" style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform="translate(50 50)"/>\n');
  });

  test('toSVG with alpha colors fill', function() {
    var rect = new fabric.Rect({ width: 100, height: 100, strokeWidth: 0, fill: 'rgba(255, 0, 0, 0.5)' });
    var svg = rect.toSVG();
    equal(svg, '<rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,0,0); fill-opacity: 0.5; fill-rule: nonzero; opacity: 1;" transform="translate(50 50)"/>\n');
  });

  test('toSVG with id', function() {
    var rect = new fabric.Rect({id: 'myRect', width: 100, height: 100, strokeWidth: 0, fill: 'rgba(255, 0, 0, 0.5)' });
    var svg = rect.toSVG();
    equal(svg, '<rect id="myRect" x="-50" y="-50" rx="0" ry="0" width="100" height="100" style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,0,0); fill-opacity: 0.5; fill-rule: nonzero; opacity: 1;" transform="translate(50 50)"/>\n');
  });

  test('toSVG with alpha colors stroke', function() {
    var rect = new fabric.Rect({ width: 100, height: 100, strokeWidth: 0, fill: '', stroke: 'rgba(255, 0, 0, 0.5)' });
    var svg = rect.toSVG();
    equal(svg, '<rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" style="stroke: rgb(255,0,0); stroke-opacity: 0.5; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(50 50)"/>\n');
  });

  test('toSVG with paintFirst set to stroke', function() {
    var rect = new fabric.Rect({ width: 100, height: 100, paintFirst: 'stroke' });
    var svg = rect.toSVG();
    equal(svg, '<rect x="-50" y="-50" rx="0" ry="0" width="100" height="100" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform="translate(50.5 50.5)" paint-order="stroke" />\n');
  });

  test('toObject without default values', function() {
    var options = { type: 'rect', width: 69, height: 50, left: 10, top: 20 };
    var rect = new fabric.Rect(options);
    rect.includeDefaultValues = false;
    deepEqual(rect.toObject(), options);
  });

  test('paintFirst life cycle', function( assert ) {
    var done = assert.async();
    var svg = '<svg><rect x="10" y="10" height="50" width="55" fill="red" stroke="blue" paint-order="stroke" /></svg>';
    fabric.loadSVGFromString(svg, function(envlivedObjects) {
      var rect = envlivedObjects[0];
      var rectObject = rect.toObject();
      var rectSvg = rect.toSVG();
      equal(rect.paintFirst, 'stroke');
      equal(rectObject.paintFirst, 'stroke');
      ok(rectSvg.indexOf('paint-order="stroke"') > -1);
      done();
    });
  });
})();
