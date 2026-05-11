import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

export type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTask'>;
export type AddTaskRouteProp = RouteProp<RootStackParamList, 'AddTask'>;
