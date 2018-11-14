import React, { Component } from 'react';
import {
  Box,
  Heading,
  Text,
  Image,
  Card,
  Button,
  Mask,
  IconButton,
} from 'gestalt';
import { Link } from 'react-router-dom';
import { calculatedPrice, setCart, getCart } from '../utils';

/* strapi configuration */
import Strapi from 'strapi-sdk-javascript/build/main';
const apiURL = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiURL);

class Brews extends Component {
  state = {
    brews: [],
    brand: '',
    cartItems: [],
  };

  async componentDidMount() {
    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `
          query {
            brand(id: "${this.props.match.params.brandId}") {
              _id
              name
              brews {
                _id
                name
                description
                image {
                  url
                }
                price
              }
            }
          }
        `,
        },
      });
      this.setState({
        brews: response.data.brand.brews,
        brand: response.data.brand.name,
        cartItems: getCart(),
      });
    } catch (err) {
      console.error(err);
    }
  }

  addtoCart = brew => {
    const alreadyInCart = this.state.cartItems.findIndex(
      item => item._id === brew._id,
    );

    if (alreadyInCart === -1) {
      const updateItems = this.state.cartItems.concat({
        ...brew,
        quantity: 1,
      });

      this.setState({ cartItems: updateItems }, () => setCart(updateItems));
    } else {
      const updateItems = [...this.state.cartItems];
      updateItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updateItems }, () => setCart(updateItems));
    }
  };

  deleteItemFromCart = itemToDeleteId => {
    const filteredItems = this.state.cartItems.filter(
      item => item._id != itemToDeleteId,
    );
    this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
  };

  render() {
    const { brand, brews, cartItems } = this.state;

    return (
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="start"
        dangerouslySetInlineStyle={{
          __style: {
            flexWrap: 'wrap-reverse',
          },
        }}
      >
        <Box display="flex" direction="column" alignItems="center">
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
          </Box>
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: '#bdcdd9',
              },
            }}
            wrap
            shape="rounded"
            display="flex"
            justifyContent="center"
            padding={4}
          >
            {brews.map(brew => (
              <Box paddingY={4} margin={2} width={210} key={brew._id}>
                <Card
                  image={
                    <Box height={200} width={200}>
                      <Image
                        fit="cover"
                        alt="Brand"
                        naturalHeight={1}
                        naturalWidth={1}
                        src={`${apiURL}${brew.image.url}`}
                      />
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                  >
                    <Box marginBottom={2}>
                      <Text bold size="xl">
                        {brew.name}
                      </Text>
                    </Box>
                    <Text>{brew.description}</Text>
                    <Text color="orchid">${brew.price}</Text>
                    <Box marginTop={2}>
                      <Text bold size="xl">
                        <Button
                          onClick={() => this.addtoCart(brew)}
                          color="blue"
                          text="Add to Cart"
                        />
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
        {/* User Cart Area */}

        <Box marginLeft={7} alignSelf="end">
          <Mask shape="rounded" wash>
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              padding={2}
            >
              {/* User Cart Heading */}
              <Heading align="center" size="md">
                Your Cart
              </Heading>
              <Text color="gray" italic>
                {cartItems.length} items selected
              </Text>

              {/* Car items */}

              {cartItems.map(item => (
                <Box key={item._id} display="flex" alignItems="center">
                  <Text>
                    {item.name} x {item.quantity} -
                    {(item.quantity * item.price).toFixed(2)}
                  </Text>
                  <IconButton
                    accessibilityLabel="Delete Item"
                    icon="cancel"
                    size="sm"
                    iconColor="red"
                    onClick={() => this.deleteItemFromCart(item._id)}
                  />
                </Box>
              ))}

              {/* Carts will add */}
              <Box
                display="flex"
                alignContent="center"
                justifyContent="center"
                direction="column"
              >
                <Box margin={2}>
                  {cartItems.length === 0 && (
                    <Text color="red">Please selecet some items</Text>
                  )}
                </Box>
                <Text size="lg">Total {calculatedPrice(cartItems)}</Text>
                <Text>
                  <Link to="/checkout">Checkout</Link>
                </Text>
              </Box>
            </Box>
          </Mask>
        </Box>
      </Box>
    );
  }
}

export default Brews;
