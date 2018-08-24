interface TListener {
    id: Symbol;
    fn: TListenerFn;
    eventId: string;
    thisArg: any;
}

export type TListenerFn = ((...data: any[]) => any);

export class EventEmitter {

    private listenersByEvent: {
        [eventId: string]: TListener[];
    } = {};

    private listeners: {
        [listenerId: string]: TListener;
    } = {};

    public on(eventId: string, fn: TListenerFn, thisArg?: any): Symbol {

        const id = Symbol();
        const listeners = this.listenersByEvent[eventId as any] || (this.listenersByEvent[eventId as any] = []);
        const listener = {
            id,
            fn,
            eventId: eventId as any,
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

    public emit(eventId: string, data: any[]): void {

        const listeners = this.listenersByEvent[eventId];
        if (!listeners) return;

        listeners.forEach(({ fn, thisArg }) => {
            fn.apply(thisArg, data);
        });

    }

}