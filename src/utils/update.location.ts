import { check, PERMISSIONS, request } from 'react-native-permissions';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import Environments from './environments';
import updateUserLocation from '../api/update.location';
import { getUserId } from './user.id';
import { GEOLOCATION_TIMEOUT_MILLIS, GEOLOCATION_MAX_AGE_MILLIS } from './constants';

const checkLocation = async () => {
    try {
        const locationAccess = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return locationAccess;
    } catch(error) {
        if (Environments.appEnv !== 'prod') {
            console.log('Check location error', error)
        }
    }
}

const askLocationAccess = async () => {
    try {
        const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return response;
    } catch(error) {
        if (Environments.appEnv !== 'prod') {
            console.log('Request location error', error)
        }
    }
}

const updateLocation = async () => {
    try {
        const userId = getUserId() as number;
        const info: GeolocationResponse = await (
            new Promise((resolve, reject) => {
                Geolocation.watchPosition(
                    info => resolve(info), 
                    error => {
                        if (Environments.appEnv !== 'prod') {
                            console.log('Get location error', error)
                        }
                    },
                    {   
                        timeout: GEOLOCATION_TIMEOUT_MILLIS,
                        maximumAge: GEOLOCATION_MAX_AGE_MILLIS
                    }
                );
            })
        );
        if (info) {
            const { latitude, longitude } = info.coords;
            await updateUserLocation(userId, {
                latitude, longitude
            });
        }
    } catch(error) {
        if (Environments.appEnv !== 'prod') {
            console.log('Update location error', error)
        }
    }
}

export { askLocationAccess, checkLocation, updateLocation }