const cta = document.querySelector('.cta');

document.addEventListener('mousemove', (event) => {
    const boxRect = cta.getBoundingClientRect();
    const boxCenterX = boxRect.left + boxRect.width / 2;
    const boxCenterY = boxRect.top + boxRect.height / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const offsetX = (boxCenterX - mouseX) / 20;
    const offsetY = (boxCenterY - mouseY) / 20;

    cta.style.boxShadow = `${offsetX}px ${offsetY}px 0px rgba(182,99,151,0.75)`;
});
