const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const Order = require("../persistence/models/order");
const verifyJwt = require("../middleware/auth");
const {
  validateAddOrderRequestBody,
  validateUpdateOrderRequestBody,
  validateGetOrderRequestQuery,
} = require("../validator/order");
const { hash } = require("../utils/encryption");

router.post("/add-order", verifyJwt, async (req, res) => {
  try {
    const adminUuid = req.user.uuid;
    const { customerName, visitTime, phone, address, workers, items } =
      validateAddOrderRequestBody(req.body);

    const newOrder = new Order({
      orderId: uuidv4(),
      customerName,
      visitTime,
      phone,
      address,
      workers: workers ? workers : [],
      items: items ? items : [],
      addedBy: adminUuid,
    });

    await newOrder.save();

    return res.status(201).json({
      status: 201,
      message: "Order added",
      data: {
        orderId: newOrder.orderId,
        customerName,
        visitTime,
        phone,
        address,
        workers: newOrder.workers,
        items: newOrder.items,
        addedBy: newOrder.addedBy,
        modifiedBy: newOrder.modifiedBy,
        status: newOrder.status,
      },
    });
  } catch (e) {
    console.error(`Error in post order`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

router.get("/get-order", verifyJwt, async (req, res) => {
  try {
    const { skip, limit, status } = validateGetOrderRequestQuery(req.query);
    const filter = {};

    if (status) {
      filter["status"] = status;
    }

    const orders = await Order.find(filter).skip(skip).limit(limit);

    return res.status(200).json({
      status: 200,
      data: orders.map((order) => {
        return {
          orderId: order.orderId,
          customerName: order.customerName,
          visitTime: order.visitTime,
          phone: order.phone,
          address: order.address,
          workers: order.workers,
          items: order.items,
          addedBy: order.addedBy,
          modifiedBy: order.modifiedBy,
          status: order.status,
        };
      }),
    });
  } catch (e) {
    console.error(`Error in get order`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

router.get("/get-order/:orderId", verifyJwt, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        status: 404,
        message: "Not Found",
        data: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: {
        orderId: order.orderId,
        customerName: order.customerName,
        visitTime: order.visitTime,
        phone: order.phone,
        address: order.address,
        workers: order.workers,
        items: order.items,
        addedBy: order.addedBy,
        modifiedBy: order.modifiedBy,
        status: order.status,
      },
    });
  } catch (e) {
    console.error(`Error in get order by id`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

router.patch("/update-order/:orderId", verifyJwt, async (req, res) => {
  try {
    const adminUuid = req.user.uuid;
    const { orderId } = req.params;
    const { customerName, visitTime, phone, address, workers, items, status } =
      validateUpdateOrderRequestBody(req.body);

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        status: 404,
        message: "Not Found",
        data: null,
      });
    }

    const updateObj = {};

    if (customerName) {
      updateObj["customerName"] = customerName;
    }

    if (visitTime) {
      updateObj["visitTime"] = visitTime;
    }

    if (phone) {
      updateObj["phone"] = phone;
    }

    if (workers) {
      updateObj["workers"] = workers;
    }

    if (address) {
      updateObj["address"] = salary;
    }

    if (items) {
      updateObj["items"] = items;
    }

    if (status) {
      updateObj["status"] = status;
    }

    const modifiedBy = order.modifiedBy;
    modifiedBy.push(adminUuid);

    updateObj["modifiedBy"] = modifiedBy;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      updateObj,
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      data: {
        orderId: updatedOrder.orderId,
        customerName: updatedOrder.customerName,
        visitTime: updatedOrder.visitTime,
        phone: updatedOrder.phone,
        address: updatedOrder.address,
        workers: updatedOrder.workers,
        items: updatedOrder.items,
        addedBy: updatedOrder.addedBy,
        modifiedBy: updatedOrder.modifiedBy,
        status: updatedOrder.status,
      },
      message: "Order Details Updated Successfully!",
    });
  } catch (e) {
    console.error(`Error in update order by id`, e);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

module.exports = router;
