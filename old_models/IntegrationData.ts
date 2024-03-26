export class IntegrationData {
    organization_id: number
    record_uri: string
    record_cite: string
    record_name: string
    record_repo: string
    origin: string

    constructor({
        organization_id = 0,
        record_uri = '',
        record_cite = '',
        record_name = '',
        record_repo = '',
        origin = ''
    } : IntegrationData) {
        this.organization_id = organization_id
        this.record_uri = record_uri
        this.record_cite = record_cite
        this.record_name = record_name
        this.record_repo = record_repo
        this.origin = origin
    }
}
