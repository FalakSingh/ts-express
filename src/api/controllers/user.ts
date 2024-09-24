import { UserService } from "../services";
import { successRes } from "../helpers/api-response";
import { ExpressHandler } from "../types/express";
import { HttpStatus } from "../constants/api.constants";

const getUserDetails: ExpressHandler = async (req, res) => {
  const userDetails = await UserService.fetchDetails(req.params.id);
  return successRes(
    res,
    HttpStatus.ok,
    "User details fetched successfully",
    userDetails
  );
};

export { getUserDetails };
