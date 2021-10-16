const catchAsyncErrors = (theFunc) => (err, res, next) => {
    Promise.resolve(theFunc(err, res, next)).catch(next)
}

export default catchAsyncErrors;