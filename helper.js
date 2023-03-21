// shorthand properties
exports.success = (message, data) => {
    return { message, data }
}

exports.getUniqueId = (coworkings) => {
    const coworkingsIds = coworkings.map(coworking => coworking.id)

    //const maxId = coworkingsIds.reduce((a, b) => Math.max(a, b))

    let maxId = coworkingsIds[0];

    coworkingsIds.forEach(element => {
        if (element > maxId) maxId = element;
    });

    const uniqueId = maxId + 1

    return uniqueId
}

