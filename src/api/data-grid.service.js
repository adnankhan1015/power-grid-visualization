const API_URL = "https://api.thunder.softoo.co/vis/api";

export const getPowerGridData = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/ssu/fixed`);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Couldn't get Power grid data");
    }
  } catch (error) {
    console.log(error);
    console.log("Api Failing", error?.response?.message);
  }
  return null;
};
