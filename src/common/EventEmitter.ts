interface TListener<T> {
    id: Symbol;
    fn: TListenerFn<T>;
    eventId: string;
    thisArg: any;
}

export type TListenerFn<T = any> = ((data: T) => any);

export class EventEmitter<T = any> {

    private listenersByEvent: {
        [eventId: string]: TListener<T>[];
    } = {};

    private listeners: {
        [listenerId: string]: TListener<T>;
    } = {};

    public on(eventId: string, fn: TListenerFn, thisArg?: any): Symbol {

        const id = Symbol();
        const listeners = this.listenersByEvent[eventId] || (this.listenersByEvent[eventId] = []);
        const listener = {
            id,
            fn,
            eventId,
            thisArg,
        };

        listeners.push(listener);
        this.listeners[id as any] = listener;

        return id;

    }

    public off(listenerId: Symbol): void {

        const listener = this.listeners[listenerId as any];
        if (!listener) return;

        const listeners = this.listenersByEvent[listener.eventId];
        const index = listeners.indexOf(listener);

        this.listenersByEvent[listener.eventId] = [
            ...listeners.slice(0, index),
            ...listeners.slice(index + 1),
        ];
        delete this.listeners[listenerId as any];

        if (this.listenersByEvent[listener.eventId].length === 0) delete this.listenersByEvent[listener.eventId];

    }

    public emit(eventId: string, data: T): void {
        const listeners = this.listenersByEvent[eventId];
        if (!listeners) return;

        listeners.forEach(({ fn, thisArg }) => {
            fn.call(thisArg, data);
        });
    }

}