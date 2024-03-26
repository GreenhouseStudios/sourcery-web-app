function sortByTimePropertyAsc (a, b) {
    if (!a.time || !b.time) {
        return 0
    }

    if (a.time > b.time) {
        return 1
    }

    if (a.time < b.time) {
        return -1
    }

    return 0
}

function sortByTimePropertyDesc (a, b) {
    if (!a.time || !b.time) {
        return 0
    }

    if (a.time > b.time) {
        return -1
    }

    if (a.time < b.time) {
        return 1
    }

    return 0
}

function sortGroupedByProp (objs, prop) {
    let items = []

    const ref = {}
    objs.forEach((x) => {
        if (!ref[x[prop]]) {
            ref[x[prop]] = [x]
        } else {
            ref[x[prop]].push(x)
        }
    })

    const ks = Object.keys(ref)
    ks.forEach((k) => {
        items = items.concat(ref[k])
    })

    return items
}

export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            sourcerySorts: {
                sortByTimePropertyAsc,
                sortByTimePropertyDesc,
                sortGroupedByProp
            }
        }
    }
})