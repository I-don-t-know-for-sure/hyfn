interface KmsKeyARNProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
export const kmsKeyARN = process.env.kmsKeyARN || ''
