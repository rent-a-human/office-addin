const httpOptions = {
    "Accept": "application/json",
    "api-token": "yy8NV3ShwQDIS9iIQE96Gx4I5914DmgbmAvp7yTzA0ZbzFwVyIpa2LNQ36qTakeuRUs",
    "user-email": "begarzonf@slabcode.com"
};

export class FiledataService {

    getIp() {
        return fetch('https://jsonip.com').then(response => response.json());
    }

    getTokenCountries() {
        return fetch(`https://www.universal-tutorial.com/api/getaccesstoken`, {
            method: "GET",
            headers: httpOptions,
        }).then((response) => response.json());
    }

    getCountries(bearer) {
        const httpOptions2 = {
            "Authorization": "Bearer " + bearer,
            "Accept": "application/json"
        };
        return fetch(`https://www.universal-tutorial.com/api/countries/`, {
            method: "GET",
            headers: httpOptions2,
        }).then((response) => response.json());
    }

}

const filedataService = new FiledataService();

export default filedataService;
