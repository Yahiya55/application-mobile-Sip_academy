import React, {useState} from 'react';
import { View, Text, Image,  StyleSheet, TextInput,TouchableOpacity,ScrollView} from 'react-native';


import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const LoginScreen = () => {

  const [email, setEmail] = useState('') ;
    const [password, setPassword] = useState('') ;
 
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigations = useNavigation ();
    const [error, setError] =useState("");
  
 
    return (      
      <View style={{ flex: 1 ,backgroundColor: '#ffffff'}}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={{backgroundColor: '#ffffff',}}>           
              <View style={{ backgroundColor: '#1F3971', padding: 50, borderBottomLeftRadius: 60 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                <Image
                style={{ width: '100%', height: 80 }}
                source={require('../assets/sipwhite.png')}
                />
                {/* Ajoutez le texte ici, juste après l'Image */}
                
            </View>
        </View>

              </View>
 
              <View style={{backgroundColor: '#1F3971',}}>
   
           
              <View style={{justifyContent: 'center',
              backgroundColor: '#fff',
              paddingHorizontal: 30,  
              borderTopRightRadius: 60}}>      
               <View style={styles.spacing_big}></View>  
               {error && (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )}
               <View style={styles.label}>
                   <Text style={styles.label}>Email</Text>
               </View>
               <TextInput
                   style={styles.input}
                  setValue={setEmail}
          onChangeText={setEmail}
          value={email}          
               />
               <View style={styles.spacing}></View>
               <View style={styles.label}>
                   <Text style={styles.label}>Mot de passe</Text>
                   </View>
                   <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible} // Toggle password visibility
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
               <View style={styles.spacing}></View>         
               <TouchableOpacity>
                   <View
                    style={{
                      margin: 10,
                      backgroundColor: '#1F3971' ,
                      justifyContent: 'center',
                       alignItems: 'center',
                       borderRadius: 100,
                       paddingVertical: 10,}}>
                        <Text
                        style={{
                          color:'white',
                          fontSize: 20 }}>Connexion </Text>
                   </View>
               </TouchableOpacity>
               </View>
               </View>      
               </ScrollView>
               <View style={styles.footer}>
      <Text style={styles.text}>©2024 Smart It Partner - Tous droits réservés</Text>
    </View>
           </View>        
  );
};


const styles = StyleSheet.create({
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
    backgroundColor: '#e7e7e7',
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  passwordInput: {
    flex: 1,
    height: 40,  
  },
  spacing: {
        margin: 10
    },
    spacing_big: {
      margin: 10
  },  
    label: {
        fontWeight: '300',
        paddingLeft: 5,
        fontSize: 17,
        color: '#999', 
    },  
    input: {
        height: 40,
        margin: 5,
        borderRadius: 100,
        backgroundColor: '#e7e7e7',
        padding: 10,
      },
      imagecontainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      image_logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',     
      },
      card: {
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        borderRadius: 7,
        elevation: 5,
        marginTop: 100,
      },
      footer: {
        backgroundColor: 'white',
        paddingVertical: 10,
        alignItems: 'center',
      },
      text: {
        color: 'gray',
        fontSize: 14,
      }, 
      welcomeText: {
        color: 'white', // Couleur blanche pour le texte, changez selon vos préférences
        fontSize: 18, // Taille de police, ajustez selon vos besoins
        marginTop: -32,
        fontWeight: '600', // Espace au-dessus du texte, ajustez selon vos besoins
        // Ajoutez d'autres propriétés de style comme fontWeight, fontFamily, etc.
      },
      errorContainer: {
        marginVertical: 10,
        padding: 0,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.1)', // Light red background color
      },
      errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
      },

});
export default LoginScreen;
