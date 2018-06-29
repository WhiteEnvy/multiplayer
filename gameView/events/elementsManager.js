var elementEvents = {
    customEvent: {
        eventObj: new Event ("customEvent"),
        dispatch: () => {
            window.dispatchEvent(elementEvents.customEvent.eventObj)
        },
        listen: () => {
            // any func
        }
    },
    gameOver: {
        eventObj: new Event ("gameOver"),
        dispatch: () => {
            window.dispatchEvent(elementEvents.gameOver.eventObj)
        },
        listen: () => {
            game.gameOver();
        }
    },
    startRender: {
        eventObj: new Event('startRender'),
        dispatch: () => {
            window.dispatchEvent(elementEvents.startRender.eventObj)
        },
        listen: (event) => {
            renderer.renderQueue.add(event.constructor.name);
            renderer.isRunning = true;
        }
    },
    stopRender: {
        eventObj: new Event('stopRender'),
        dispatch: () => {
            window.dispatchEvent(elementEvents.stopRender.eventObj)
        },
        listen: (event) => {
            renderer.renderQueue.remove(event.constructor.name);
            renderer.isRunning = false;
        }
    }
};


for(let key in elementEvents){
    window.addEventListener(key, elementEvents[key].listen);
}