import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/LoginScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Formations") {
                        iconName = focused ? "school" : "school-outline";
                    } else if (route.name === "Sessions") {
                        iconName = focused ? "calendar" : "calendar-outline";
                    } else if (route.name === "Actualites") {
                        iconName = focused ? "newspaper" : "newspaper-outline";
                    }

                    else if (route.name === "Login") {
                        iconName = focused ? "enter" : "enter-outline";
                    }
                    return (
                        <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                            <Ionicons name={iconName} color={color} size={focused ? 32 : 28} style={styles.icon} />
                        </View>
                    );
                },
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#ffc107',
                tabBarInactiveTintColor: '#C0C0C0',
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ headerShown: false }}
            />
            <Tab.Screen 
                name="Formations" 
                component={HomeScreen} 
                options={{ headerShown: false }}
            />
            <Tab.Screen 
                name="Sessions" 
                component={HomeScreen} 
                options={{ headerShown: false }}
            />
            <Tab.Screen 
                name="Actualites" 
                component={HomeScreen} 
                options={{ headerShown: false }}
            />

            <Tab.Screen 
                name="Login" 
                component={Login} 
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: width * 0.05,
        right: width * 0.05,
        height: 55,
        borderRadius: 40,
        backgroundColor: '#1f3971',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 20,
        paddingHorizontal: 25,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
        width: 55,
        borderRadius: 30,
    },
    activeIconContainer: {
       
        borderRadius: 30,
        padding: 0,
    },
    icon: {
        marginTop: -20,
    }
});
