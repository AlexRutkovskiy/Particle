import { SETTINGS } from './const';

class Particles {

    constructor(options) {

        const defaults = {
            idCanvas: '#canvas',
            bgColor: '#000000'
        };

        this.options = {...defaults, ...options};
        this.canvas = document.querySelector(this.options.idCanvas);
        this.context = this.canvas.getContext('2d');
        this.arrayFigures = [];
        this.init();
    };

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.fillArrayFigures();
    };

    fillArrayFigures() {
        for(let i = 0; i < this.options.pointCount; i++) {
            let point = {
                x : this.randomValue(0, this.canvas.width),
                y : this.randomValue(0, this.canvas.height),
                angle : this.randomValue(0, 2 * Math.PI)
            }
            this.arrayFigures.push(point);
        }
    };

    randomValue(min, max) {
        return min + Math.random() * (max-min + 1);
    };

    drawRect() {
        this.context.fillStyle = this.options.bgColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    drawPointer() {
        for(const pointer of this.arrayFigures) {
            this.context.beginPath();
            this.context.fillStyle = this.options.pointColor;
            this.context.arc(pointer.x, pointer.y, this.options.pointRadius, 0, 2 * Math.PI);
            this.context.fill();
            this.context.closePath();
        };
    };

    movePointer() {
        for(const pointer of this.arrayFigures) {
            pointer.x = pointer.x + this.options.pointSpeed * Math.cos(pointer.angle);
            pointer.y = pointer.y + this.options.pointSpeed * Math.sin(pointer.angle);

            if(pointer.x < 0) {
                pointer.x = this.canvas.width + pointer.x;
            };
            if(pointer.x > this.canvas.width) {
                pointer.x = this.canvas.width - pointer.x;
            };
            if(pointer.y < 0) {
                pointer.y = this.canvas.height + pointer.y;
            }
            if(pointer.y > this.canvas.height) {
                pointer.y = this.canvas.height - pointer.y;
            }
        };
    };

    getDist(a, b) {
        return ((a.x - b.x)**2 + (a.y - b.y)**2)**0.5;
    };

    drawLines() {
        for(let i = 0; i < this.arrayFigures.length -1; i++) {
            for(let j = i + 1; j < this.arrayFigures.length; j++ ) {
                const pointerA = this.arrayFigures[i];
                const pointerB = this.arrayFigures[j];
                const dist = this.getDist(pointerA, pointerB);

                if(dist <= this.options.pointDis) {
                    this.context.beginPath();
                    this.context.strokeStyle = this.options.pointColor;
                    this.context.moveTo(pointerA.x, pointerA.y);
                    this.context.lineTo(pointerB.x, pointerB.y);
                    this.context.stroke();
                    this.context.closePath();
                }
            }
        }
    };

    tick() {
        this.drawRect();
        this.movePointer();
        this.drawPointer();
        this.drawLines();

        requestAnimationFrame(this.tick.bind(this));
    };
}

const particles = new Particles({...SETTINGS});
particles.tick();