addListeners();

let idHeartBit =0;
let obj = undefined;
moveAndHide = 0;
function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });


    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('movePlay2')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 20, y:20}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMove(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            obj = animaster().heartBeating(block, 5000);
            obj.start();
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            obj.stop();
        });
}




function animaster() {
    let _steps = [];
    return {
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */

        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        }
        ,
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */

        fadeIn (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        }
        ,

        moveAndHide (element, duration) {
            this.move(element, 2 * (duration/5), {x: 100, y:20});
            moveAndHide = setTimeout(() => {
                this.fadeOut(element, 3 * (duration/5));
            }, 2 * (duration/5));
        },

        heartBeating (element, duration) {
            const o = this;
            return {
                start(){
                    idHeartBit = setInterval(() => {
                        setTimeout(() => {
                            o.scale(element, 250, 1.4)
                        }, 0);
                        setTimeout(() => {
                            o.scale(element, 250, 1)
                        }, 250);
                    }, 500);
                },
                stop(){
                    clearInterval(idHeartBit);
                }
            }
             // выводит 0, затем 1, затем 2

        },

        showAndHide (element, duration) {
            this.fadeIn(element, duration/3);
            setTimeout(() => {
                this.fadeOut(element, (duration/3));
            }, 2 * (duration/3));
        },

        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        },

        resetMove(element){
            this.resetMoveAndScale(element);
            this.resetFadeOut(element);
            clearInterval(moveAndHide);
        },

        addMove(duration, translation) {
            _steps.push([this.move, duration, translation]);
            return this;
        },

        addScale(duration, translation) {
            _steps.push([this.scale, duration, ratio]);
            return this;
        },

        addFadeIn(duration, translation) {
            _steps.push([this.fadeIn, duration]);
            return this;
        },

        addFadeOut(duration, translation) {
            _steps.push([this.fadeOut, duration]);
            return this;
        },

        play(element) {
            let totalTime = 0;
            for (const data of _steps) {
                let [func, ...args] = data;
                args.unshift(element);
                totalTime += args[1];
                setTimeout(() => func.apply(null, args), totalTime);
            }
        }

    };
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
