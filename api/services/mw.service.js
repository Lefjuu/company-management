// exports.verifyToken = async (headers, userId) => {
//     try {
//         const token = headers.authorization.split(' ')[1];

//         const decoded = jwt.verify(token, JWT_SECRET_ACCESS_KEY); // Replace 'your-secret-key' with your actual JWT secret key

//         // Check if the decoded user ID matches the user ID in the request
//         if (decoded.id !== userId) {
//             return res.status(401).json({
//                 message: 'Unauthorized',
//             });
//         }

//         // If the user ID matches, continue to the next middleware
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             message: 'Unauthorized',
//         });
//     }
// };
