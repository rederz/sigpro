package pojo;
// Generated Dec 28, 2016 1:25:08 PM by Hibernate Tools 5.2.0.CR1

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * UsuarioLogId generated by hbm2java
 */
@Embeddable
public class UsuarioLogId implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6423161861790498513L;
	private String usuario;
	private Date fecha;

	public UsuarioLogId() {
	}

	public UsuarioLogId(String usuario, Date fecha) {
		this.usuario = usuario;
		this.fecha = fecha;
	}

	@Column(name = "usuario", length = 30)
	public String getUsuario() {
		return this.usuario;
	}

	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}

	@Column(name = "fecha", length = 19)
	public Date getFecha() {
		return this.fecha;
	}

	public void setFecha(Date fecha) {
		this.fecha = fecha;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof UsuarioLogId))
			return false;
		UsuarioLogId castOther = (UsuarioLogId) other;

		return ((this.getUsuario() == castOther.getUsuario()) || (this.getUsuario() != null
				&& castOther.getUsuario() != null && this.getUsuario().equals(castOther.getUsuario())))
				&& ((this.getFecha() == castOther.getFecha()) || (this.getFecha() != null
						&& castOther.getFecha() != null && this.getFecha().equals(castOther.getFecha())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result + (getUsuario() == null ? 0 : this.getUsuario().hashCode());
		result = 37 * result + (getFecha() == null ? 0 : this.getFecha().hashCode());
		return result;
	}

}
