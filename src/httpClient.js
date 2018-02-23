import axios from 'axios';
import { AxiosBase } from './axiosBase';
import { config } from './xmlStatsApiConfig';

export class HttpClient extends AxiosBase {
 
    constructor () {
        super( config )
        this.instance = axios.create( this.axiosConfig );
        
    }

}

new HttpClient()