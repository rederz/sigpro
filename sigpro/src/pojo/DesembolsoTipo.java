package pojo;
// Generated Dec 28, 2016 1:25:08 PM by Hibernate Tools 5.2.0.CR1

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * DesembolsoTipo generated by hbm2java
 */
@Entity
@Table(name = "desembolso_tipo", catalog = "sigpro")
public class DesembolsoTipo implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3788835023180806226L;
	private Integer id;
	private String nombre;
	private String descripcion;
	private Integer estado;
	private Set<Desembolso> desembolsos = new HashSet<Desembolso>(0);

	public DesembolsoTipo() {
	}

	public DesembolsoTipo(String nombre, String descripcion, Integer estado, Set<Desembolso> desembolsos) {
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.estado = estado;
		this.desembolsos = desembolsos;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)

	@Column(name = "id", unique = true, nullable = false)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "nombre", length = 1000)
	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	@Column(name = "descripcion", length = 4000)
	public String getDescripcion() {
		return this.descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	@Column(name = "estado")
	public Integer getEstado() {
		return this.estado;
	}

	public void setEstado(Integer estado) {
		this.estado = estado;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "desembolsoTipo")
	public Set<Desembolso> getDesembolsos() {
		return this.desembolsos;
	}

	public void setDesembolsos(Set<Desembolso> desembolsos) {
		this.desembolsos = desembolsos;
	}

}
