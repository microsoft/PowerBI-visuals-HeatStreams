module essex.visuals.gantt {
    const ON_PREFIX = '__ON_EVENT__';
    export const on = (event: string) => `${ON_PREFIX}${event}`;

    type BasicSelection = d3.Selection<any, any, any, any>;

    export function d3Append(parent: BasicSelection, tag: string, attrMap: any = {}) {
        let result = parent.append(tag);
        
        Object.keys(attrMap).forEach(key => {
            if (key.indexOf(ON_PREFIX) === 0) {
                const eventName = key.slice(3);
                result = result.on(eventName, attrMap[key]);
            } else {
                result = result.attr(key, attrMap[key]);
            }
        });

        return result;
    }
}