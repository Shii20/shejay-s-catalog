const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let circles = [];
let selectedCircle = null;
let isDragging = false;

const DEFAULT_RADIUS = 20;
const MIN_RADIUS = 5;

function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle === selectedCircle ? '#90168e' : '#5a0d8a';
    ctx.fill();
  });
}

function getCircleAt(x, y) {
  return circles.find(c =>
    Math.hypot(c.x - x, c.y - y) <= c.radius
  );
}

// Mouse down
canvas.addEventListener("mousedown", function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const clicked = getCircleAt(x, y);

  if (clicked) {
    selectedCircle = clicked;
    isDragging = true;
  } else {
    // Add new circle
    circles.push({ x, y, radius: DEFAULT_RADIUS });
    selectedCircle = null;
  }

  drawCircles();
});

// Mouse move
canvas.addEventListener("mousemove", function(e) {
  if (isDragging && selectedCircle) {
    const rect = canvas.getBoundingClientRect();
    selectedCircle.x = e.clientX - rect.left;
    selectedCircle.y = e.clientY - rect.top;
    drawCircles();
  }
});

// Mouse up
canvas.addEventListener("mouseup", function() {
  isDragging = false;
});

// Mouse wheel for resizing
canvas.addEventListener("wheel", function(e) {
  if (selectedCircle) {
    e.preventDefault();
    selectedCircle.radius += e.deltaY < 0 ? 2 : -2;
    if (selectedCircle.radius < MIN_RADIUS) {
      selectedCircle.radius = MIN_RADIUS;
    }
    drawCircles();
  }
});

// Delete key to remove selected circle
document.addEventListener("keydown", function(e) {
  if (e.key === "Delete" && selectedCircle) {
    circles = circles.filter(c => c !== selectedCircle);
    selectedCircle = null;
    drawCircles();
  }
});

// Initial draw
drawCircles();