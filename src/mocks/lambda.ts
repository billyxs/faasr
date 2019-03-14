export default function lambdaMock(params) {
  return {
    invoke() {
      return {
        promise() {
          return Promise.resolve(true)
        }
      } 
    }
  }
}
