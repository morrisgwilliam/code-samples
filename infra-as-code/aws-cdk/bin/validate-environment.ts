const requiredEnvironmentVariables = [
    'CDK_ACCOUNT' ,
    'CDK_REGION',
    'ENVIROMENT',
    'DOMAIN_NAME',
]

const optionalEnvironmentVariables = [
    'SUBDOMAIN_NAME',
]


export const validateRequiredEnvironment = () => {
    requiredEnvironmentVariables.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`)
        }
    })
}
export const validateOptionalEnvironment = () => {
    optionalEnvironmentVariables.forEach((envVar) => {
        if (!process.env[envVar]) {
            console.info(`Missing optional environment variable: ${envVar}`)
        }
    })
}

export default validateRequiredEnvironment