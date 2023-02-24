/* eslint no-undef: "off" */
/* eslint  no-unused-expressions: "off" */
/* eslint  no-restricted-syntax: "off" */
/* eslint  no-param-reassign: "off" */
/* eslint  func-names: "off" */
const logger = require("./logger");

function isValidFilter(paths, filters) {
  const schemaAttributes = Object.keys(paths);
  const requestFilters = Object.keys(filters);
  return requestFilters.every((f) => schemaAttributes.includes(f));
}

function formatRegexFilter(filters) {
  for (const i in filters) {
    if (typeof filters[i] === "object") {
      for (const j in filters[i]) {
        if (j === "$regex") {
          filters[i][j] = new RegExp(filters[i][j], "i");
        }
      }
    }
  }
  return filters;
}

exports.searchByFilter = async function (filter, model, limit) {
  if (!filter) {
    const objects = await model.find().limit(limit);
    return {
      status: "success",
      message: "fetched",
      results: objects,
      statusCode: 200,
    };
  }
  const { paths } = model.schema;
  const filtersValid = isValidFilter(paths, filter);
  if (filtersValid) {
    const objects = await model.find(filter).limit(limit);
    if (!objects) {
      return {
        status: "fail",
        message: "not found",
        results: null,
        statusCode: 404,
      };
    }
    return {
      status: "success",
      message: "fetched",
      results: objects,
      statusCode: 200,
    };
  }

  return {
    status: "fail",
    message: "some or all filters are not part of the schema",
    results: null,
    statusCode: 500,
  };
};

exports.searchByOrFilters = async function (
  filters,
  model,
  limit,
  populate = []
) {
  if (!filters) {
    let objects = {};
    if (model.modelName === "Blog" || model.modelName === "Question") {
      objects = await model.find().sort({ updatedAt: -1 }).limit(limit);
    } else {
      objects = await model.find().limit(limit);
    }
    return {
      status: "success",
      message: "fetched",
      results: objects,
      statusCode: 200,
    };
  }
  const { paths } = model.schema;
  let filtersValid = true;
  filters.forEach((filter) => {
    filtersValid = filtersValid && isValidFilter(paths, filter);
    filter = formatRegexFilter(filter);
  });
  if (filtersValid) {
    let objects = {};
    if (model.modelName === "Blog" || model.modelName === "Question") {
      objects = await model
        .find({ $or: filters })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .populate(populate);
    } else {
      objects = await model
        .find({ $or: filters })
        .limit(limit)
        .populate(populate);
    }
    if (!objects) {
      return {
        status: "fail",
        message: "not found",
        results: null,
        statusCode: 404,
      };
    }
    // if (model.modelName === "Blog" || model.modelName === "Question") {
    //   objects.sort((a, b) => {
    //     return new Date(b.updatedAt) - new Date(a.updatedAt);
    //   });
    // }
    return {
      status: "success",
      message: "fetched",
      results: objects,
      statusCode: 200,
    };
  }

  return {
    status: "fail",
    message: "some or all filters are not part of the schema",
    results: null,
    statusCode: 500,
  };
};

exports.searchByFilterWithDominantField = async function (
  filter,
  model,
  dominantField,
  limit
) {
  // get 90% of the limit as intger
  const limitDominant = Math.floor(limit * 0.9);
  filter[dominantField] = true;
  const dominantResults = await searchByFilter(filter, model, limitDominant);
  // get 10% of the limit as intger
  const limitDominated = limit - dominantResults.results.length;
  filter[dominantField] = false;
  const dominatedResults = await searchByFilter(filter, model, limitDominated);
  // shuffle dominant results
  const dominantResultsShuffled = shuffle(dominantResults.results);
  // shuffle dominated results
  const dominatedResultsShuffled = shuffle(dominatedResults.results);
  // merge dominant and dominated results so that dominant results are in the beginning
  const results = dominantResultsShuffled.concat(dominatedResultsShuffled);
  // if results length is greater than 3, swap the third and the last element faker move
  if (results.length > 3) {
    const temp = results[2];
    results[2] = results[results.length - 1];
    results[results.length - 1] = temp;
  }
  return {
    status: "success",
    message: "fetched",
    results: results,
    statusCode: 200,
  };
};
// searchByOrFiltersWithDominantField
exports.searchByOrFiltersWithDominantField = async function (
  filters,
  model,
  dominantField,
  limit ,
  populate = []
) {
  // get 90% of the limit as intger
  const limitDominant = Math.floor(limit * 0.9);
  filters = injectFilter(filters, dominantField, true);
  const dominantResults = await searchByOrFilters(
    filters,
    model,
    limitDominant,
    populate
  );
  // get 10% of the limit as intger
  const limitDominated = limit - dominantResults.results.length;
  filters = injectFilter(filters, dominantField, false);
  const dominatedResults = await searchByOrFilters(
    filters,
    model,
    limitDominated,
    populate
  );
  // shuffle dominant results
  const dominantResultsShuffled = shuffle(dominantResults.results);
  // shuffle dominated results
  const dominatedResultsShuffled = shuffle(dominatedResults.results);
  // merge dominant and dominated results so that dominant results are in the beginning
  const results = dominantResultsShuffled.concat(dominatedResultsShuffled);
  // if results length is greater than 3, swap the third and the last element faker move
  if (results.length > 3) {
    const temp = results[2];
    results[2] = results[results.length - 1];
    results[results.length - 1] = temp;
  }
  return {
    status: "success",
    message: "fetched",
    results: results,
    statusCode: 200,
  };
};
// inject filter in array of filters
const injectFilter = (filters, field, value) => {
  filters.forEach((filter) => {
    filter[field] = value;
  });
  return filters;
};

// shuffle array
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const searchByFilter = async function (filter, model, limit) {
  if (!filter) {
    const objects = await model.find().limit(limit);
    return {
      status: "success",
      message: "fetched",
      results: objects,
      statusCode: 200,
    };
  }
  const { paths } = model.schema;
  const filtersValid = isValidFilter(paths, filter);
  if (filtersValid) {
    const objects = await model.find(filter).limit(limit);
    if (!objects) {
      return {
        status: "fail",
        message: "not found",
        results: null,
        statusCode: 404,
      };
    }
    return {
      status: "success",
      message: "fetched",
      results: objects,
      statusCode: 200,
    };
  }

  return {
    status: "fail",
    message: "some or all filters are not part of the schema",
    results: null,
    statusCode: 500,
  };
};

const searchByOrFilters = async function (
  filters,
  model,
  limit,
  populate = []
) {
  if (!filters) {
    const objects = await model.find().limit(limit);
    return {
      status: "success",
      message: "fetched",
      results: objects,
      statusCode: 200,
    };
  }
  const { paths } = model.schema;
  let filtersValid = true;
  filters.forEach((filter) => {
    filtersValid = filtersValid && isValidFilter(paths, filter);
    filter = formatRegexFilter(filter);
  });
  if (filtersValid) {
    const objects = await model
      .find({ $or: filters })
      .limit(limit)
      .populate(populate);
    if (!objects) {
      return {
        status: "fail",
        message: "not found",
        results: null,
        statusCode: 404,
      };
    }
    return {
      status: "success",
      message: "fetched",
      results: objects,
      statusCode: 200,
    };
  }

  return {
    status: "fail",
    message: "some or all filters are not part of the schema",
    results: null,
    statusCode: 500,
  };
};

exports.generateId = async function (model) {
  const id = (await model.countDocuments()) + 1000;
  return id;
};

exports.sendEmail = async function (config) {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  try {
    const mailOptions = {
      from: "AVOCONSULTE",
      to: config.to,
      subject: config.subject,
      text: config.text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return error;
      return info.response;
    });
    logger.info(mail);
  } catch (err) {
    return err;
  }
};

exports.isInWorkingHours = (timeBlocker, workingHours) => {
  const timeBlockerBegin = new Date(timeBlocker.startDateAndTime);
  const timeBlockerBeginDay = timeBlockerBegin.toISOString().split("T")[0];
  const timeBlockerEnd = new Date(timeBlocker.endDateAndTime);
  const timeBlockerEndDay = timeBlockerEnd.toISOString().split("T")[0];
  if (timeBlockerBeginDay !== timeBlockerEndDay) {
    return false;
  }
  const workingDay = workingHours[timeBlockerBegin.getDay()];
  const targetDate = new Date(timeBlocker.startDateAndTime)
    .toISOString()
    .split("T")[0];
  const workingDayMorningBegin = new Date(
    `${targetDate}T${workingDay.startTimeMorning}.000Z`
  );
  const workingDayMorningEnd = new Date(
    `${targetDate}T${workingDay.endTimeMorning}.000Z`
  );
  const workingDayAfternoonBegin = new Date(
    `${targetDate}T${workingDay.startTimeAfternoon}.000Z`
  );
  const workingDayAfternoonEnd = new Date(
    `${targetDate}T${workingDay.endTimeAfternoon}.000Z`
  );
  let isInWorkingHours = false;
  isInWorkingHours =
    isInWorkingHours ||
    (timeBlockerBegin >= workingDayMorningBegin &&
      timeBlockerEnd >= timeBlockerBegin &&
      timeBlockerEnd <= workingDayMorningEnd);
  isInWorkingHours =
    isInWorkingHours ||
    (timeBlockerBegin >= workingDayAfternoonBegin &&
      timeBlockerEnd >= timeBlockerBegin &&
      timeBlockerEnd <= workingDayAfternoonEnd);
  return isInWorkingHours;
};

exports.validTimeBlockerFormat = (timeBlocker) => {
  result = true;
  const startDateAndTime = new Date(timeBlocker.startDateAndTime);
  const endDateAndTime = new Date(timeBlocker.endDateAndTime);
  result =
    result &&
    startDateAndTime !== "Invalid Date" &&
    !Number.isNaN(startDateAndTime);
  result =
    result &&
    endDateAndTime !== "Invalid Date" &&
    !Number.isNaN(endDateAndTime);
  result = result && !(startDateAndTime > endDateAndTime);
  result = result && Date.now() < startDateAndTime;
  return result;
};

exports.getMongUrl = () => {
  switch (process.env.NODE_ENV) {
    case "test":
      return process.env.MONGO_URL_CLIENT_TEST;
    case "dev":
      return process.env.MONGO_URL_CLIENT_DEV;
    case "prod":
      return process.env.MONGO_URL_CLIENT_PROD;
    default:
      return process.env.MONGO_URL_AUTH_DEV;
  }
};

exports.getMongAuthUrl = () => {
  switch (process.env.NODE_ENV) {
    case "test":
      return process.env.MONGO_URL_AUTH_TEST;
    case "dev":
      return process.env.MONGO_URL_AUTH_DEV;
    case "prod":
      return process.env.MONGO_URL_AUTH_PROD;
    default:
      return process.env.MONGO_URL_AUTH_DEV;
  }
};

exports.checkTimeBlockerAvailability = async (timeBlocker, users) => {
  const filter = {
    users: {
      $elemMatch: { $in: users },
    },
    startDateAndTime: { $lte: timeBlocker.endDateAndTime },
    endDateAndTime: { $gte: timeBlocker.startDateAndTime },
    blocks: true,
  };
  // check if dateAndTime is available
  const timeBlockerExists = await TimeBlockerModel.findOne(filter);
  return !timeBlockerExists;
};

exports.generateRandomString = (length) => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

// duration is the difference endDateAndTime - startDateAndTime in hours
exports.getDuration = (timeBlockerData) => {
  const start = new Date(timeBlockerData.startDateAndTime);
  const end = new Date(timeBlockerData.endDateAndTime);
  const diff = end.getTime() - start.getTime();
  return diff / (1000 * 60 * 60);
};

exports.generateAppointmentService = async (
  price,
  duration,
  clientID,
  businessID,
  name = "Face to Face Appointment"
) => {
  const serviceBooking = new ServiceBookingModel({
    business: businessID,
    client: clientID,
    name: "Face to Face Appointment",
    price: price,
    duration: duration,
    targetAudience: "both",
  });
  await serviceBooking.save();
  return serviceBooking;
};
