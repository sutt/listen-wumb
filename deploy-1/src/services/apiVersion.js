let apiVersion
const apiVersions = {
    production: 'api/v1',
    development: 'api/v1'
}

if (window.location.hostname === 'localhost')
{
    apiVersion = apiVersions.development
} else
{
    apiVersion = apiVersions.production
}

export default apiVersion