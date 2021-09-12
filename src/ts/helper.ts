import * as types from './types';
import { TIMEOUT_SEC } from './config';

// Timer for long requests
const timeout = (s: number): Promise<PromiseRejectedResult> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long!.`));
    }, s * 1000);
  });
};

// export const getJSON = async function (
//   url: string,
//   options?: object
// ): Promise<types.APIResponseTypes> {
//   try {
//     const res = await Promise.race([fetch(url, options), timeout(TIMEOUT_SEC)]);

//     // type guard
//     if (res.status === 'rejected') return;

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(`${data.message} (${res.status})`);
//     }

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async function (
//   url: string,
//   uploadData: types.SingleRecipeAPI
// ): Promise<types.APIResponseTypes> {
//   try {
//     const sendData = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([sendData, timeout(TIMEOUT_SEC)]);

//     // type guard
//     if (res.status === 'rejected') return;

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(`${data.message} (${res.status})`);
//     }

//     console.log(data);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

export const AJAX = async (
  url: string,
  uploadData: null | types.SingleRecipeAPI = null
): Promise<types.APIResponseTypes> => {
  try {
    const fetchData = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchData, timeout(TIMEOUT_SEC)]);

    // type guard
    if (res.status === 'rejected') return;
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const idMaker = () => {
  return Math.random().toString(36).substr(2, 10);
};
