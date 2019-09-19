import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdShoppingCart } from 'react-icons/md';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

import imgLoading from '../../assets/images/loading.svg';

class Home extends Component {
  state = {
    products: [],
    loading: true,
  };

  async componentDidMount() {
    const response = await api.get(`products`);

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({
      products: data,
      loading: false,
    });
  }

  handleAddProduct = async id => {
    const { addToCartRequest } = this.props;

    addToCartRequest(id);
  };

  render() {
    const { products, loading } = this.state;
    const { amount } = this.props;

    return (
      <>
        <ProductList>
          {loading ? (
            <div className="loading">
              <img src={imgLoading} alt="Carregando..." />
            </div>
          ) : (
            <>
              {products.map(product => (
                <li key={product.id}>
                  <img src={product.image} alt={product.title} />
                  <strong>{product.title}</strong>
                  <span>{product.priceFormatted}</span>

                  <button
                    type="button"
                    onClick={() => this.handleAddProduct(product.id)}
                  >
                    <div>
                      <MdShoppingCart size={16} color="#fff" />{' '}
                      {amount[product.id] || 0}
                    </div>

                    <span>Adicionar ao carrinho</span>
                  </button>
                </li>
              ))}
            </>
          )}
        </ProductList>
      </>
    );
  }
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);