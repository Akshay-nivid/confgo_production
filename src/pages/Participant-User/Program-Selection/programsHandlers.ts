
import routes from "@/router/routes";
import moment from "moment";


/**
 * Formats a given date into a string with the format "YYYY/MM/DD".
 *
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export const formatDate = (date: any) => {
  return moment(date).format("YYYY/MM/DD");
}


/**
 * Checks if there are any programs selected for a given date.
 *
 * @param date - The date to check for.
 * @param watch - The watch object from react-hook-form.
 * @returns true if there are any programs selected for the given date, false otherwise.
 */
export const isAnyProgramSelectedForDate = (date: Date, watch: any) => {

  const fieldName = `${formatDate(date)}-programs`;

  const selectedPrograms = watch(fieldName) || [];

  return selectedPrograms.length > 0;

};


/**
 * Sorts and groups data by date.
 *
 * This function takes an array of data objects, sorts them by their start time,
 * and groups them into an object based on their date. The date is formatted
 * as "MMM-DD-YYYY".
 *
 * @param data - An array of data objects that have a startTime or an eventAddon.startTime property.
 * @returns An object where each key is a date string, and its value is an array of data objects
 *          that correspond to that date.
 */
const sortData = (data: any): any => {
  if (!data?.length) {
    return {};
  }
  return data
  .filter((item: any) => item?.startTime || item?.eventAddon?.startTime) // Remove invalid items
  .sort((a: any, b: any) => {
    return (
      new Date(a?.startTime || a?.eventAddon?.startTime).getTime() -
      new Date(b?.startTime || b?.eventAddon?.startTime).getTime()
    )
  })
    .reduce((grouped: any, program: any) => {
      const date = moment(program?.startTime || program?.eventAddon?.startTime).format("MMM-DD-YYYY")

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(program);
      return grouped;
    }, {});
};



/**
 * Takes an array of programs and addons, sorts and groups them by date,
 * and returns an object where each key is a date string, and its value is
 * an object with three properties: programs, addons, and total. The
 * programs property is an array of program objects, the addons property is
 * an array of addon objects, and the total property is the sum of the
 * amounts of all programs and addons for that date. If the calculateTotal
 * option is false, the total property will be 0.
 *
 * @param {Object} options - An object with the following properties:
 *   programs: {Array} - An array of program objects
 *   addons: {Array} - An array of addon objects
 *   calculateTotal: {Boolean} - Whether or not to calculate the total
 *     amount for each date. Default is false.
 * @returns {Object} - An object where each key is a date string, and its
 *     value is an object with three properties: programs, addons, and total.
 */
export const handleGroupData = ({ programs, addons, calculateTotal = false }: { programs: any, addons: any, calculateTotal?: boolean }) => {

  const sortedPrograms = sortData(programs);
  const sortedAddons = sortData(addons);

  // Collect all dates from programs and addons
  const allkeys = sortDates([...Object.keys(sortedPrograms), ...Object.keys(sortedAddons)]);

  // Create a unique set of dates
  const uniqueKeys = new Set(allkeys);

  // Convert the unique set to a list
  const uniqueKeysList = [...uniqueKeys];

  // Add a "general" key to the unique keys if there are addons without dates
  if (addons) {
    const addonsWithoutDate = addons.filter((addon: any) => !addon.startTime);
    if (addonsWithoutDate.length > 0) {
      uniqueKeysList.unshift('general');
    }
  }

  // Format the data
  const formattedData = uniqueKeysList.reduce((acc: any, date) => {

    if (!sortedPrograms) {
      throw new Error('Programs data is required and must be an object');
    }

    if (!acc[date]) {
      acc[date] = { addons: [], programs: [], total: 0 };
    }

    // If calculateTotal is true, sum the amount for programs
    if (calculateTotal) {
      if (Array.isArray(sortedPrograms[date])) {
        sortedPrograms[date].map(prgm => {
          acc[date].total = acc[date].total + parseFloat(prgm.amount);
        });
      }
    }

    // Add programs to the corresponding date group
    if (sortedPrograms[date]) {
      acc[date].programs.push(...(sortedPrograms[date] as any[]));
    }

    // Add addons to the corresponding date group or "general" group
    if (sortedAddons[date]) {
      acc[date].addons.push(...sortedAddons[date]);
    } else if (date === 'general') {
      const addonsWithoutDate = addons.filter((addon: any) => !addon.startTime && !addon.endTime);
      acc[date].addons.push(...addonsWithoutDate);
    }

    return acc;
  }, {});

  return formattedData;
}




/**
 * Sorts an array of date strings in 'MMM-DD-YYYY' format
 * @param {string[]} dates Array of date strings in 'MMM-DD-YYYY' format
 * @param {boolean} ascending Optional parameter to determine sort order (default: true)
 * @returns {string[]} Sorted array of date strings in the same format
 */
function sortDates(dates: string[], ascending = true) {
  // Create a mapping of month abbreviations to numbers
  const monthMap: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };

  // Convert dates to a sortable format (YYYY-MM-DD)
  const convertToSortable = (dateStr: string) => {
      try {
          const [month, day, year] = dateStr?.split('-');
          const monthNum = monthMap[month];
          if (!monthNum) throw new Error(`Invalid month: ${month}`);
          
          // Pad day with leading zero if necessary
          const paddedDay = day.padStart(2, '0');
          
          return `${year}-${monthNum}-${paddedDay}`;
      } catch (error) {
          // Return a far future or past date based on ascending order
          // This will push invalid dates to the end/beginning of the sorted array
          return ascending ? '9999-99-99' : '0000-00-00';
      }
  };

  // Sort the array
  return [...dates].sort((a, b) => {
      const dateA = convertToSortable(a);
      const dateB = convertToSortable(b);
      return ascending 
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
  });
}


function sortObjectByKeyPriority(obj: any) {
  // Define the priority order for key types
  const priorityOrder = ['programs', 'addon', 'addonProp'];

  // Create a sorted array of keys based on the priority
  const sortedKeys = Object.keys(obj)?.sort((a, b) => {
    // Find the matching priority type for each key
    const aPriorityIndex = priorityOrder.findIndex(type => a.includes(type));
    const bPriorityIndex = priorityOrder.findIndex(type => b.includes(type));

    // If priority types are different, sort by their priority
    if (aPriorityIndex !== bPriorityIndex) {
      return aPriorityIndex - bPriorityIndex;
    }

    // If priority types are the same, sort alphabetically
    return a.localeCompare(b);
  });

  // Create a new object with sorted keys
  return sortedKeys.reduce((sorted: { [key: string]: any }, key) => {
    sorted[key] = obj[key];
    return sorted;
  }, {});
}


/**
 * Processes the form data from the program selection form.
 *
 * The function takes an object of form data and the id of the event, and
 * returns an object with the following properties:
 *   eventId: the id of the event
 *   programIds: an array of program ids selected
 *   addons: an array of addon objects, each with the following properties:
 *     addonId: the id of the addon
 *     propertyIds: an array of property ids selected for the addon
 *
 * The function iterates over the form data object, and for each key-value
 * pair, it checks if the key includes 'program', in which case it adds the
 * value to the programIds array. If the key includes 'addon-', it adds the
 * value to the addonGroup object, and if the key includes 'addonProp', it
 * adds the value to the propertyIds array of the corresponding addon object
 * in the addonGroup object.
 *
 * @param {Object} formData - The form data object.
 * @param {any} id - The id of the event.
 * @returns {Object} - The processed data object.
 */
export const processFormData = (formData: any, id: any, participantTypeId: string | number): { eventId: number; programIds: number[]; addons: any; } => {

  let formattedData: any

  if (participantTypeId !== null && participantTypeId !== undefined) {

    formattedData = {
      eventId: parseInt(id) || null,
      programIds: [],
      participantTypeId: participantTypeId
    }

  } else {

    formattedData = {
      eventId: parseInt(id) || null,
      programIds: [],
    }

  }


  const addonGroup: any = {}


  const sortedFormData = sortObjectByKeyPriority(formData)

  Object.entries(sortedFormData)?.forEach(([key, value]: [string, any]) => {

    if (key.includes('program') && value !== undefined) {

      if (value.length > 0) {
        formattedData.programIds.push(...value)
      }

      return
    }


    if (key.includes('addons')) {


      if (value === undefined || !value) return

      const addonKey = parseInt(key?.split('-')[1])

      addonGroup[addonKey] = {

        addonId: addonKey,
      }
    }



    if (key.includes('addonProp')) {


      // { property?.id } -${ property?.name } -${ addon?.addonId }


      if (value === undefined || value.length === 0) return

      const addonKey = parseInt(key?.split('-')[2])

      addonGroup[addonKey] = {

        addonId: addonKey,
        propertyIds: [...value]

      }

      return
    }

  })

  if (Object.keys(addonGroup).length > 0) {

    formattedData.addons = Object.values(addonGroup)

  }

  return formattedData
}






export const handleClickBackButton = (slugName: string, navigate: (params: any) => void) => {

  if (slugName) {

    navigate(routes.eventExternalLink(slugName));

  } else {

    navigate(routes.userLogin());

  }
}









