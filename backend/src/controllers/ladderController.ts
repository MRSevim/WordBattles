import { RequestHandler } from "express";

export const ladderController: RequestHandler = async (req, res, next) => {
  /*    let user: UserInterface | undefined = undefined;
    const token = req.cookies.jwt;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWTSECRET);

      user = await User.findById(decoded.userId);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;


      // Fetch all users sorted by rankedScore in descending order
      const allUsers = await User.find().sort({ rankedScore: -1 }).exec();

      // Get paginated users
      const paginatedUsers = allUsers.slice((page - 1) * limit, page * limit);

      // Find the rank of the logged-in user
      const userRank =
        allUsers.findIndex((u: UserInterface) => u.email === user?.email) + 1;

      // Format the response
      res.status(200).json({
        ladder: paginatedUsers,
        userRank: user
          ? {
              rank: userRank,
              username: user.username,
              rankedScore: user.rankedScore,
            }
          : undefined,
        totalUsers: allUsers.length,
      }); */
  return res.json({ message: "Ladder endpoint is under construction." });
};
