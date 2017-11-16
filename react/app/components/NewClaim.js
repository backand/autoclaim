var React = require('react');
var PropTypes = require('prop-types');
var Link = require('react-router-dom').Link;
var Loading = require('./Loading');
var Claim = require('../utils/claim');

class NewClaim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      claim: {
        id: '',
        cloud: '',
        imageUrl: null,
        vehicleUrl: null,
        plate: null,
        vehicle: null,
      },
      loading: false,
      claimImgUrl: null
    };
  }

  /**
   * @description 
   * @memberof NewClaim
   */
  componentDidMount() {
    document.getElementById('fileinput').addEventListener("change", function () {
      var file = document.querySelector('input[type=file]').files[0];
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        this.setState(function () {
          return {
            claimImgUrl: reader.result,
            reader: reader
          };
        });
      }.bind(this), false);
      if (file) {
        reader.readAsDataURL(file);
      }
    }.bind(this), false);
  }

  handleSubmit() {
    this.create(null, this.state.reader.result);
  }
  handleReset() {
    this.setState(function () {
      var newState = {
        claimImgUrl: null,
        reader: null,
        claim: {},
        error: null,
        loading: false
      };
      return newState;
    });
  }
  /**
   * @description 
   * @param {any} inputUrl 
   * @param {any} fileData 
   * @memberof NewClaim
   */
  create(inputUrl, fileData) {
    this.setState(function () {
      return {
        loading: true,
        error: null,
      };
    });
    fileData = (fileData) ? fileData : $scope.photo
    if (!inputUrl) {
      Claim.upload(fileData)
        .then(function (response) {
          console.log(response.data.url);
          this.createClaim(response.data.url);
          this.setState(function () {
            return {
              loading: false,
              error: null,
            };
          });
        }.bind(this))
        .catch(function (err) {
          console.log(err);
          this.setState(function () {
            return {
              loading: false,
              error: err.data || err.statusText
            };
          });
        }.bind(this))
    } else {
      this.createClaim(inputUrl);
    }
  }
  /**
   * @description 
   * @memberof NewClaim
   */
  createClaim(inputUrl) {
    Claim.create(inputUrl)
      .then(function (result) {
        console.log(result.data);
        this.setState(function () {
          return {
            claim: {
              id: "1w11" + result.data.id,
              cloud: result.data.cloud,
              imageUrl: result.data.imageUrl,
              vehicleUrl: result.data.vehicleUrl,
              plate: result.data.plate,
              vehicle: JSON.parse(result.data.vehicle)
            }
          }
        });
        this.setState(function () {
          return {
            loading: false,
            showResult: true
          };
        });
      }.bind(this))
      .catch(function (err) {
        console.log(err);
        this.setState(function () {
          return {
            loading: false,
            error: err.data || err.statusText
          };
        });
      }.bind(this));
  }

  render() {
    return (
      <div>
        <Loading loading={this.state.loading} />
        {
          this.state.error ? <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
            : ''
        }
        <form className='column' noValidate>
          <div className='form-group'>
            <label htmlFor="exampleFile" className='form-control-label'>Browse file</label>
            <input className='form-control' type="file" name="file" id="fileinput" />
            {
              this.state.claimImgUrl ? <img src={this.state.claimImgUrl} style={{ maxWidth: '100%' }} /> : ''
            }
          </div>
          <button
            className='btn btn-primary'
            type='button'
            onClick={this.handleSubmit.bind(this)}
            disabled={!this.state.claimImgUrl}>
            Report Claim
        </button>

          <button
            className='btn btn-link'
            type='button'
            onClick={this.handleReset.bind(this)}>
            Cancel
        </button>

        </form>
      </div>
    )
  }
}

module.exports = NewClaim;