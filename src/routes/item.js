const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const Item = require("../persistence/models/item");
const verifyJwt = require("../middleware/auth");
const {
  validateAddItemRequestBody,
  validateUpdateItemRequestBody,
} = require("../validator/item");
const uploadImage = require("../middleware/uploadImage");
const { uploadImageToS3 } = require("../libs/S3,js");
const allowedRoles = require("../middleware/allowedRoles");

router.post(
  "/add-item/:orderId",
  uploadImage,
  verifyJwt,
  allowedRoles(["ADMIN", "EMPLOYEE"]),
  async (req, res) => {
    try {
      const uuid = req.user.uuid;
      const { orderId } = req.params;
      const { itemName, properties } = validateAddItemRequestBody(req.body);

      if (!req.file) {
        return res.status(400).json({
          status: 400,
          message: "File is required",
          data: null,
        });
      }

      const image = await uploadImageToS3(req.file, uuidv4());

      const newItem = new Item({
        itemId: uuidv4(),
        orderId,
        itemName,
        properties,
        addedBy: uuid,
        image,
      });

      await newItem.save();

      return res.status(201).json({
        status: 201,
        message: "Employee added",
        data: {
          itemId: newItem.itemId,
          orderId: newItem.orderId,
          itemName,
          properties,
          image,
          addedBy: uuid,
          modifiedBy: newItem.modifiedBy,
        },
      });
    } catch (e) {
      console.error(`Error in post employee`, e);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }
);

router.get(
  "/get-item/:itemId",
  verifyJwt,
  allowedRoles(["ADMIN", "EMPLOYEE"]),
  async (req, res) => {
    try {
      const { itemId } = req.params;
      const item = await Item.findOne({ itemId });

      if (!item) {
        return res.status(404).json({
          status: 404,
          message: "Not Found",
          data: null,
        });
      }

      return res.status(200).json({
        status: 200,
        data: {
          itemId,
          orderId: item.orderId,
          itemName: item.itemName,
          image: item.image,
          properties: item.properties,
          addedBy: item.addedBy,
          modifiedBy: item.modifiedBy,
        },
      });
    } catch (e) {
      console.error(`Error in get employee by id`, e);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }
);

router.get(
  "/get-items/:orderId",
  verifyJwt,
  allowedRoles(["ADMIN", "EMPLOYEE"]),
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const items = await Item.find({ orderId });

      return res.status(200).json({
        status: 200,
        data: items.map((item) => {
          return {
            itemId: item.itemId,
            orderId: item.orderId,
            itemName: item.itemName,
            image: item.image,
            properties: item.properties,
            addedBy: item.addedBy,
            modifiedBy: item.modifiedBy,
          };
        }),
      });
    } catch (e) {
      console.error(`Error in get employee by id`, e);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }
);

router.patch(
  "/update-item/:itemId",
  uploadImage,
  verifyJwt,
  allowedRoles(["ADMIN", "EMPLOYEE"]),
  async (req, res) => {
    try {
      const uuid = req.user.uuid;
      const { itemId } = req.params;
      const { itemName, properties } = validateUpdateItemRequestBody(req.body);

      const item = await Item.findOne({ itemId });

      if (!item) {
        return res.status(500).json({
          status: 500,
          message: "Some issue occured",
          data: null,
        });
      }

      const modifiedBy = item.modifiedBy;
      modifiedBy.push(uuid);

      const updateObj = {};

      if (itemName) {
        updateObj["itemName"] = itemName;
      }

      if (properties && properties.length > 0) {
        updateObj["properties"] = properties;
      }

      if (req.file) {
        const image = await uploadImageToS3(req.file, uuidv4());
        updateObj["image"] = image;
      }

      const updatedItem = await Item.findOneAndUpdate({ itemId }, updateObj, {
        new: true,
      });

      return res.status(201).json({
        status: 201,
        message: "Employee added",
        data: {
          itemId: updatedItem.itemId,
          orderId: updatedItem.orderId,
          itemName: updatedItem.itemName,
          properties: updatedItem.properties,
          addedBy: updatedItem.addedBy,
          image: updatedItem.image,
          modifiedBy: updatedItem.modifiedBy,
        },
      });
    } catch (e) {
      console.error(`Error in post employee`, e);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }
);

router.delete(
  "/delete-item/:itemId",
  verifyJwt,
  allowedRoles(["ADMIN", "EMPLOYEE"]),
  async (req, res) => {
    try {
      const { itemId } = req.params;

      const filter = { itemId };

      await Item.deleteOne(filter);

      return res.status(200).json({
        status: 200,
        message: "Employee Deleted Successfully!",
      });
    } catch (e) {
      console.log(`Error deleting the employee`, e);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }
);

module.exports = router;
