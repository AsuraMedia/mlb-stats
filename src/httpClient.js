import axios from 'axios';
import { AxiosBase } from './axiosBase';

export class HttpClient extends AxiosBase {

    constructor( config ) {
        super(config)
        this.instance = axios.create(this.axiosConfig);
    }

    get( url, params = {} ) {
        return this.instance.get( url, params )
            .catch((err) => {
                return err
            })
            .then((res) => {
                return res.data
            })
    }

}