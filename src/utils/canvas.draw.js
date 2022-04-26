const RADIUS = 5;

// 画原点和线
export function drawPointAndLine(ctx, list, isDrawClose) {
  if (ctx == null || undefined === ctx) return;
  const isDrawCloseTemp = isDrawClose == null ? true : isDrawClose;
  const { canvas } = ctx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  list.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2, true);
    // 两点画线
    const p2 = list[(i + 1) % list.length];
    if (i === (list.length - 1)) {
      // 如果是最后一个点的时候，判断是否需要封闭图形
      if (isDrawCloseTemp) {
        ctx.moveTo(p.x, p.y);// 起始位置
        ctx.lineTo(p2.x, p2.y);// 停止位置
      }
    } else {
      ctx.moveTo(p.x, p.y);// 起始位置
      ctx.lineTo(p2.x, p2.y);// 停止位置
    }
    ctx.closePath();

    ctx.strokeStyle = 'rgba(255,0,0,1)';
    ctx.stroke();

    ctx.fillStyle = 'red';
    ctx.fill();
  });
}

// 仅仅画点
export function drawPoints(ctx, list) {
  const { canvas } = ctx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  list.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
  });
}

// 再判断是否在圆点范围内
// 检测两个圆是否发生碰撞：两个圆心之间的距离是否小于两圆半径之和，小于：碰撞，否则没碰撞
export function hitCircle(source, target, r) {
  const dis1 = (source.x - target.x) ** 2;
  const dis2 = (source.y - target.y) ** 2;
  const distance = Math.sqrt(dis1 + dis2);
  return distance < r + r;
}

// 检查是否可以画点
export function checkDraw(source, list) {
  if (list.length < 1) return true;

  let index = 0;
  // 先循环要画的圆是否在已经画好的数组中
  for (; index < list.length; index++) {
    const pObj = list[index];
    if (source.x === pObj.x && source.y === pObj.y) {
      return false;
    }

    if (hitCircle(source, pObj, RADIUS) === true) {
      return false;
    }
  }

  return true;
}

// 点击画点且连线
export function clickDrawPoint(ctx, p, list) {
  if (ctx == null || undefined === ctx) return;
  ctx.beginPath();
  ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2, true);
  if (list.length > 0) {
    // 两点画线
    const p2 = list[list.length - 1];
    ctx.moveTo(p.x, p.y);// 起始位置
    ctx.lineTo(p2.x, p2.y);// 停止位置
  }
  ctx.closePath();

  ctx.strokeStyle = 'rgba(255,0,0,1)';
  ctx.stroke();

  ctx.fillStyle = 'red';
  ctx.fill();
}

// 撤回画点
export function backDraw(ctx, p, list) {
  if (ctx == null || undefined === ctx) return;
  const { canvas } = ctx;
  if (p !== undefined) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    list.forEach((pObj, i) => {
      ctx.beginPath();
      ctx.arc(pObj.x, pObj.y, RADIUS, 0, Math.PI * 2, true);
      if (i < (list.length - 1)) {
        // 两点画线
        const p2 = list[(i + 1) % list.length];
        ctx.moveTo(pObj.x, pObj.y);// 起始位置
        ctx.lineTo(p2.x, p2.y);// 停止位置
      }
      ctx.closePath();

      ctx.strokeStyle = 'rgba(255,0,0,1)';
      ctx.stroke();

      ctx.fillStyle = 'red';
      ctx.fill();
    });
  }
}

// 清除画圆
let stepClear = 1;// 别忘记这一步
// 圆心(x,y)，半径r
export function clearArc(ctx, x, y, r) {
  if (ctx == null || undefined === ctx) return;
  const calcWidth = r - stepClear;
  const calcHeight = Math.sqrt((r * r) - (calcWidth * calcWidth));

  const posX = x - calcWidth;
  const posY = y - calcHeight;

  const widthX = 2 * calcWidth;
  const heightY = 2 * calcHeight;

  if (stepClear <= r) {
    ctx.clearRect(posX, posY, widthX, heightY);
    stepClear += 1;
    clearArc(x, y, r);
  }
}


export function clearCircle(ctx, x, y, r) {
  if (ctx == null || undefined === ctx) return;
  stepClear = 1;// 别忘记这一步
  clearArc(ctx, x, y, r);
}

// 计算叉乘
export function crossMul(v1, v2) {
  return (v1.x * v2.y) - (v1.y * v2.x);
}

// 相交返回true
export function checkCross(p1, p2, p3, p4) {
  let v1 = { x: p1.x - p3.x, y: p1.y - p3.y };
  let v2 = { x: p2.x - p3.x, y: p2.y - p3.y };
  let v3 = { x: p4.x - p3.x, y: p4.y - p3.y };
  const v = crossMul(v1, v3) * crossMul(v2, v3);

  v1 = { x: p3.x - p1.x, y: p3.y - p1.y };
  v2 = { x: p4.x - p1.x, y: p4.y - p1.y };
  v3 = { x: p2.x - p1.x, y: p2.y - p1.y };

  if (v < 0 && crossMul(v1, v3) * crossMul(v2, v3) < 0) {
    return true;
  }
  return false;
}

// 判断两条线段是否相交
export function checkCrossForList(list) {
  // 至少4个及4个以上顶点
  if (list.length > 3) {
    // 最后两个点组成线段，判断该线段与其他点组成的线段是否相交
    const p1 = list[list.length - 1];
    const p2 = list[list.length - 2];
    // 总共有list.length - 2条线段，其中
    // list[0], list[1] 一条
    // list[1], list[2] 一条
    // list[2], list[3] 一条
    // list[.], list[..] 一条
    for (let i = 0; i < list.length - 2; i++) {
      const p3 = list[i];
      const p4 = list[i + 1];
      if (checkCross(p1, p2, p3, p4)) {
        return true;
      }
    }
  }
  return false;
}

// 检测最后封闭时是否有相交
export function checkCrossForList2(list) {
  // 至少4个及4个以上顶点才去检测
  if (list.length > 3) {
    // 最后一个点与第一个点组成线段，判断该线段与其他点组成的线段是否相交
    const p1 = list[list.length - 1];
    const p2 = list[0];
    // 总共有list.length条线段，其中
    // list[0], list[1] 一条
    // list[1], list[2] 一条
    // list[2], list[3] 一条
    // list[.], list[..] 一条
    // list[..], list[0] 一条
    for (let i = 0; i < list.length; i++) {
      const p3 = list[i];
      const p4 = list[(i + 1) % list.length];
      if (checkCross(p1, p2, p3, p4)) {
        return true;
      }
    }
  }
  return false;
}

// 得到canvas的坐标
export function getCanvasPos(event, canvas) {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;

  return { x, y };
}

// 画矩形
export function drawRect(ctx, x, y, w, h, color) {
  if (ctx == null || undefined === ctx) return;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.strokeStyle = color;
  ctx.stroke();
}

// 画带有背景颜色的矩形
export function drawRectBackColor(ctx, x, y, w, h, color) {
  if (ctx == null || undefined === ctx) return;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// 画勾
export function drawTick(ctx, x1, y1, x2, y2, color) {
  if (ctx == null || undefined === ctx) return;
  ctx.beginPath();
  const x3 = x1 + (Math.abs(x2 - x1) / 3);
  const y3 = y1 + Math.abs(y2 - y1);
  ctx.moveTo(x1, y1);// 起始位置
  ctx.lineTo(x3, y3);// 停止位置
  ctx.lineTo(x2, y2);// 停止位置
  // ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.restore();
}

// 画带有背景颜色的checkbox
export function drawTickBackColor(ctx, x, y, w, h, bgColor, tickColor) {
  if (ctx == null || undefined === ctx) return;
  drawRectBackColor(ctx, x, y, w, h, bgColor);
  const x1 = x + 3;
  const y1 = y + (h / 2);
  const x2 = (x + w) - 3;
  const y2 = y + 3;
  drawTick(ctx, x1, y1, x2, y2, tickColor);
}

// 绘制文字
export function drawTxt(ctx, content, x, y, color, fontSize = 14) {
  if (ctx == null || undefined === ctx) return;
  ctx.font = `bold ${fontSize}px PingFang-SC`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = color;
  ctx.fillText(content, x, y);
}
