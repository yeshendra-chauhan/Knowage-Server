/* SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. */
package it.eng.spagobi.commons.metadata;

import java.util.HashSet;
import java.util.Set;

/**
 * SbiExtRoles generated by hbm2java
 */

public class SbiExtRoles extends SbiHibernateModel {

	// Fields

	private Integer extRoleId;
	private SbiDomains roleType;
	private String roleTypeCode;
	private String code;
	private String name;
	private String descr;

	private Set sbiFuncRoles;
	private Set sbiParuseDets;
	private Set sbiMetaModelCategories;
	private Set sbiAuthorizationsRoleses = new HashSet(0);

	// Constructors

	/**
	 * default constructor.
	 */
	public SbiExtRoles() {
	}

	/**
	 * constructor with id.
	 *
	 * @param extRoleId
	 *            the ext role id
	 */
	public SbiExtRoles(Integer extRoleId) {
		this.extRoleId = extRoleId;
	}

	// Property accessors

	/**
	 * Gets the ext role id.
	 *
	 * @return the ext role id
	 */
	public Integer getExtRoleId() {
		return this.extRoleId;
	}

	/**
	 * Sets the ext role id.
	 *
	 * @param extRoleId
	 *            the new ext role id
	 */
	public void setExtRoleId(Integer extRoleId) {
		this.extRoleId = extRoleId;
	}

	/**
	 * Gets the role type.
	 *
	 * @return the role type
	 */
	public SbiDomains getRoleType() {
		return this.roleType;
	}

	/**
	 * Sets the role type.
	 *
	 * @param sbiDomains
	 *            the new role type
	 */
	public void setRoleType(SbiDomains sbiDomains) {
		this.roleType = sbiDomains;
	}

	/**
	 * Gets the role type code.
	 *
	 * @return the role type code
	 */
	public String getRoleTypeCode() {
		return this.roleTypeCode;
	}

	/**
	 * Sets the role type code.
	 *
	 * @param roleTypeCd
	 *            the new role type code
	 */
	public void setRoleTypeCode(String roleTypeCd) {
		this.roleTypeCode = roleTypeCd;
	}

	/**
	 * Gets the code.
	 *
	 * @return the code
	 */
	public String getCode() {
		return this.code;
	}

	/**
	 * Sets the code.
	 *
	 * @param code
	 *            the new code
	 */
	public void setCode(String code) {
		this.code = code;
	}

	/**
	 * Gets the name.
	 *
	 * @return the name
	 */
	public String getName() {
		return this.name;
	}

	/**
	 * Sets the name.
	 *
	 * @param name
	 *            the new name
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * Gets the descr.
	 *
	 * @return the descr
	 */
	public String getDescr() {
		return this.descr;
	}

	/**
	 * Sets the descr.
	 *
	 * @param descr
	 *            the new descr
	 */
	public void setDescr(String descr) {
		this.descr = descr;
	}

	/**
	 * Gets the sbi func roles.
	 *
	 * @return the sbi func roles
	 */
	public Set getSbiFuncRoles() {
		return this.sbiFuncRoles;
	}

	/**
	 * Sets the sbi func roles.
	 *
	 * @param sbiFuncRoles
	 *            the new sbi func roles
	 */
	public void setSbiFuncRoles(Set sbiFuncRoles) {
		this.sbiFuncRoles = sbiFuncRoles;
	}

	/**
	 * Gets the sbi paruse dets.
	 *
	 * @return the sbi paruse dets
	 */
	public Set getSbiParuseDets() {
		return this.sbiParuseDets;
	}

	/**
	 * Sets the sbi paruse dets.
	 *
	 * @param sbiParuseDets
	 *            the new sbi paruse dets
	 */
	public void setSbiParuseDets(Set sbiParuseDets) {
		this.sbiParuseDets = sbiParuseDets;
	}

	/**
	 * @return the sbiMetaModelCategories
	 */
	public Set getSbiMetaModelCategories() {
		return sbiMetaModelCategories;
	}

	/**
	 * @param sbiMetaModelCategories
	 *            the sbiMetaModelCategories to set
	 */
	public void setSbiMetaModelCategories(Set sbiMetaModelCategories) {
		this.sbiMetaModelCategories = sbiMetaModelCategories;
	}

	public Set getSbiAuthorizationsRoleses() {
		return this.sbiAuthorizationsRoleses;
	}

	public void setSbiAuthorizationsRoleses(Set sbiAuthorizationsRoleses) {
		this.sbiAuthorizationsRoleses = sbiAuthorizationsRoleses;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((extRoleId == null) ? 0 : extRoleId.hashCode());
		return result;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		SbiExtRoles other = (SbiExtRoles) obj;
		if (extRoleId == null) {
			if (other.extRoleId != null)
				return false;
		} else if (!extRoleId.equals(other.extRoleId))
			return false;
		return true;
	}

}