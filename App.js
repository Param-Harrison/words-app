import React from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage
} from "react-native";
import { AppLoading, Asset, Font, Constants } from "expo";
import { Ionicons } from '@expo/vector-icons'
import RootNavigation from './navigation/RootNavigation'
import { Provider } from 'react-redux'
import './reactotron'
import createStore from './redux'

const store = createStore()

export default class App extends React.Component {
  state = {
    assetsAreLoaded: false
  }

  componentWillMount() {
    // console.tron.log('reactotron loaded')
    this._loadAssetsAsync()
    this.storeConstants()
  }

  render() {
    if (!this.state.assetsAreLoaded && !this.props.skipLoadingScreen) {
      return <AppLoading />
    } else {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar hidden barStyle="default" />}
            {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
            <RootNavigation />
          </View>
        </Provider>
      )
    }
  }

  storeConstants = () => {
    const thingsToStore = ["sessionId", 'platform', 'deviceYearClass', 'deviceName', 'statusBarHeight']
    for (var i = 0; i < thingsToStore.length; i++) {
      key = thingsToStore[i]
      AsyncStorage.setItem(key, JSON.stringify(Constants[key]));
    }
  }

  async _loadAssetsAsync() {
    try {
      await Promise.all([
        // Asset.loadAsync([
        //   require('./assets/images/robot-dev.png'),
        //   require('./assets/images/robot-prod.png')
        // ]),
        Font.loadAsync([
          // This is the font that we are using for our tab bar
          Ionicons.font,
          {
            'chaucher': require('./fonts/chaucher.ttf')
          },
          {
            'eileen': require('./fonts/eileen.ttf')
          }
          // We include SpaceMono because we use it in WordsScreen.js. Feel free
          // to remove this if you are not using it in your app
        ])
      ])
    } catch (e) {
      // In this case, you might want to report the error to your error
      // reporting service, for example Sentry
      console.warn(
        'There was an error caching assets (see: App.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      )
      console.log(e)
    } finally {
      this.setState({ assetsAreLoaded: true })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
})

// Expo.registerRootComponent(App)
