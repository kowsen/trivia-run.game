import { type Readable, get, readable, derived } from "svelte/store";

type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;

export function memoDerived<S extends Stores, T>(...args: Parameters<typeof derived<S, T>>): Readable<T> {
	const store = derived<S, T>(...args);
  let lastValue = get(store);
  return readable(lastValue, set =>  store.subscribe(value => {
      if (value !== lastValue) {
        set(value);
        lastValue = value;
      }
    }
  ));
}