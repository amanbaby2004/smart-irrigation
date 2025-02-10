type Style = {
    [key: string]: {
      [key: string]: string | number
    }
  }
  
  export const globalStyles: Style = {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    data: {
      fontSize: 18,
      marginVertical: 5,
    },
    connectionStatus: {
      fontSize: 16,
      marginTop: 20,
      color: 'gray',
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
      paddingHorizontal: 25,
      backgroundColor: '#2f95dc',
      borderRadius: 5,
      color: '#fff',
    },
  };