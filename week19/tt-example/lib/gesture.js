// enableGesture(document.body);

export function enableGesture(element) {
  let contexts = Object.create(null);

  let MOUSE_SYMBOL = Symbol('mouse');

  if (document.ontouchstart !== null) {
    element.addEventListener(
      'mousedown',
      (event) => {
        contexts[MOUSE_SYMBOL] = Object.create(null);
        start(event, contexts[MOUSE_SYMBOL]);
        let mousemove = (event) => {
          move(event, contexts[MOUSE_SYMBOL]);
        };
        let mouseend = (event) => {
          end(event, contexts[MOUSE_SYMBOL]);
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseend);
        };

        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseend);
      },
      false
    );
  }

  element.addEventListener('touchstart', (event) => {
    for (let touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier]);
    }
  });
  element.addEventListener('touchmove', (event) => {
    for (let touch of event.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  });
  element.addEventListener('touchend', (event) => {
    for (let touch of event.changedTouches) {
      end(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });
  element.addEventListener('touchcancel', (event) => {
    for (let touch of event.changedTouches) {
      cancel(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });

  let start = (point, context) => {
    element.dispatchEvent(
      new CustomEvent('start', {
        startX: point.clientX,
        startY: point.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
      })
    );
    context.startX = point.clientX;
    context.startY = point.clientY;

    //flick 算速度，要筛选最近300毫秒的点 =>记录点
    context.moves = [];

    //变量
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;

    context.timeoutHandler = setTimeout(() => {
      //已经是pan了，就不可逆了，不能再变回press
      if (context.isPan) {
        return;
      }
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      element.dispatchEvent(new CustomEvent('pressstart', {}));
      // console.log("press start")
    }, 500);
  };
  let move = (point, context) => {
    let dx = point.clientX - context.startX,
      dy = point.clientY - context.startY;
    //pan
    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress)
        element.dispatchEvent(new CustomEvent('presscannel', {}));
      // console.log("press end")
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;

      // console.log("pan start")
      element.dispatchEvent(
        Object.assign(new CustomEvent('panstart', {}), {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
        })
      );
    }

    if (context.isPan) {
      //flick 把点存进去，要筛选最近300毫秒的点
      context.moves.push({
        dx,
        dy,
        t: Date.now(),
      });
      context.moves = context.moves.filter(
        (recode) => Date.now() - recode.t < 300
      );
      console.log('pan');
      element.dispatchEvent(
        Object.assign(new CustomEvent('pan', {}), {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
        })
      );
    }
  };
  let end = (point, context) => {
    let dx = point.clientX - context.startX,
      dy = point.clientY - context.startY;
    if (context.isTap) {
      // console.log("tap end")
      // var event = new CustomEvent("tap", {});

      element.dispatchEvent(new CustomEvent('tap', {}));
    }
    if (context.isPan) {
      //flick
      let recode = context.moves[0];
      let speed =
        Math.sqrt((recode.dx - dx) ** 2 + (recode.dy - dy) ** 2) /
        (Date.now() - recode.t);
      let isFlick = speed > 2.5;
      if (isFlick) {
        // console.log("flick")
        element.dispatchEvent(
          Object.assign(new CustomEvent('flick', {}), {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            speed: speed,
          })
        );
      }

      element.dispatchEvent(
        Object.assign(new CustomEvent('panend', {}), {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed: speed,
          isFlick: isFlick,
        })
      );
    }
    if (context.isPress) {
      element.dispatchEvent(new CustomEvent('pressend', {}));
      // console.log("press end")
    }
    clearTimeout(context.timeoutHandler);
  };
  let cancel = (point, context) => {
    // console.log("cancel")
    element.dispatchEvent(new CustomEvent('cancel', {}));
    clearTimeout(context.timeoutHandler);
  };
}
