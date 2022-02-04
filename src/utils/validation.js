export function validateRowNumber(parsedJson, parsedRowNumber) {
  if (!Number.isInteger(parsedRowNumber)) {
    return false;
  }

  if (parsedJson.length < parsedRowNumber) {
    return false;
  }

  return true;
}

export function validateJson(parsedJson) {
  if (!Array.isArray(parsedJson)) {
    return false;
  }

  if (parsedJson.length > 50) {
    return false;
  }

  for (const node of parsedJson) {
    if (isNaN(node.weight)) {
      return false;
    }

    if (!typeof node.name === "string") {
      return false;
    }

    if (node.name.length >= 50) {
      return false;
    }

    const checkRepeatNameJson = parsedJson.filter(p => p.name === node.name);
    if (checkRepeatNameJson.length > 1) {
      return false;
    }
  }

  return true;
}
