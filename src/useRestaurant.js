import { useContext } from 'react'
import { RestaurantContext } from './context/restaurantContext'

export const useRestaurant = () => useContext(RestaurantContext)