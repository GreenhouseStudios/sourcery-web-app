export default defineNuxtPlugin(nuxtApp => {
    const getJsonLdFile = (request) => {
        console.log(request)
        const jsonLd = {
            '@context': {
                '@version': 1.1,
                '@base': '',
                '@vocab': 'https://tropy.org/v1/tropy#',
                template: {
                    '@type': '@id'
                },
                photo: {
                    '@id': 'https://tropy.org/v1/tropy#photo',
                    '@container': '@list'
                },
                note: {
                    '@id': 'https://tropy.org/v1/tropy#note',
                    '@container': '@list'
                },
                selection: {
                    '@id': 'https://tropy.org/v1/tropy#selection',
                    '@container': '@list'
                },
                title: 'http://purl.org/dc/elements/1.1/title',
                date: {
                    '@id': 'http://purl.org/dc/elements/1.1/date',
                    '@type': 'https://tropy.org/v1/tropy#date'
                },
                creator: 'http://purl.org/dc/elements/1.1/creator'
            },
            '@graph': [
                {
                    '@type': 'Item',
                    template: 'https://tropy.org/v1/templates/generic',
                    title: request.request_client.label,
                    creator: request.repository.organization.name,
                    date: request.updated_at,
                    photo: []
                }
            ],
            version: '1.15.2'
        }

        request.attachments.forEach((file) => {
            console.log(file)
            jsonLd['@graph'][0].photo.push({
                '@type': 'Photo',
                checksum: 'unknown',
                mimetype: 'unknown',
                path: `${file.label ? file.label : file.getFileNameAndExtension()}`,
                template: 'https://tropy.org/v1/templates/photo',
                title: file.label ? file.label : file.getFileNameAndExtension(),
                date: file.created_at
            })
        })

        return jsonLd
    }

    return {
        provide: {
            getJsonLdFile
        }
    }
})
