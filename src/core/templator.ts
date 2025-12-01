import Handlebars from 'handlebars';

/**
 * Утилита для работы с шаблонизатором Handlebars
 * Используется для компиляции HTML шаблонов с подстановкой данных
 */
export class Templator {
  /**
   * Компилирует шаблон с переданными данными
   * @param template - строка шаблона Handlebars
   * @param context - объект с данными для подстановки
   * @returns скомпилированная HTML строка
   */
  public static compile(template: string, context: Record<string, unknown> = {}): string {
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(context);
  }

  /**
   * Регистрирует helper функцию в Handlebars
   * @param name - имя helper'а
   * @param fn - функция helper'а
   */
  public static registerHelper(name: string, fn: Handlebars.HelperDelegate): void {
    Handlebars.registerHelper(name, fn);
  }

  /**
   * Удаляет зарегистрированный helper
   * @param name - имя helper'а для удаления
   */
  public static unregisterHelper(name: string): void {
    Handlebars.unregisterHelper(name);
  }
}
